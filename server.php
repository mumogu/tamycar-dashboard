<?php

// based on Symfony2 framework, which is not included here

namespace AppBundle\Controller;

use Sensio\Bundle\FrameworkExtraBundle\Configuration\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use GuzzleHttp\Client;

class DefaultController extends Controller
{
    const MIN_LAT_E6 = 50718842;
    const MAX_LAT_E6 = 50821266;
    const MIN_LON_E6 = 5932734;
    const MAX_LON_E6 = 6262506;
    const API_KEY = 'pFR8HJ0v5OWCqg6xbaWS5TrCA3Vlr35X';

    /**
     * @Route("/{scenario}", name="homepage")
     */
    public function indexAction(Request $request, $scenario)
    {
        $memcached = $this->get('memcached');

        /* @var $session \Symfony\Component\HttpFoundation\Session\Session */
        $session = $request->getSession();
        $session->save();

        $data = new \stdClass();
        $position = new \stdClass();
        $position->time = date('Y-m-d\TH:i:s.000\Z');

        $fuel_level = $memcached->get($scenario . '::fuel_level');
        $mileage = $memcached->get($scenario . '::mileage');
        $positions = $memcached->get($scenario . '::positions');

        if (!($nextPosition = $memcached->get($scenario . '::currentPosition'))) {
            $nextPosition = ['lat' => rand(self::MIN_LAT_E6, self::MAX_LAT_E6) / 1E6, 'lon' => rand(self::MIN_LON_E6, self::MAX_LON_E6) / 1E6];
        }

        if ($switchIgnition = $memcached->get($scenario . '::switchIgnition')) {
            $data->position = $position;
            $data->immobilizer = 'locked';
            $data->ignition = $switchIgnition == 'switch_on' ? 'on' : 'off';
            $data->central_lock = 'locked';
            $data->speed = '0';
            $data->voltage = '0';
            $data->doors = 'closed';
            $data->lights = 'off';
            $data->handbrake = 'locked';

            $fuel_level = rand(80, 100);
            $data->reasons = ['ignition_changed'];

            $memcached->set($scenario . '::switchIgnition', false);
        } else {
            if (!($positions) && !$memcached->get($scenario . '::finished')) {
                if (rand(1, 2) == 1) {
                    $data->position = $position;
                    $data->immobilizer = 'locked';
                    $data->ignition = 'off';
                    $data->central_lock = 'locked';
                    $data->speed = '0';
                    $data->voltage = '0';
                    $data->doors = 'closed';
                    $data->lights = 'off';
                    $data->handbrake = 'locked';
                    $data->reasons = ['central_lock_changed'];

                } else {

                    $client = new Client();
                    $from = ['lat' => $nextPosition['lat'], 'lon' => $nextPosition['lon']];
                    $to = ['lat' => rand(self::MIN_LAT_E6, self::MAX_LAT_E6) / 1E6, 'lon' => rand(self::MIN_LON_E6, self::MAX_LON_E6) / 1E6];
                    $url = 'http://open.mapquestapi.com/directions/v2/route?key=' . self::API_KEY . '&callback=renderAdvancedNarrative&outFormat=json&routeType=fastest&timeType=1&enhancedNarrative=false&shapeFormat=raw&generalize=0&locale=en_US&unit=m'
                        . '&from=' . $from['lat'] . ',' . $from['lon']
                        . '&to=' . $to['lat'] . ',' . $to['lon']
                        . '&drivingStyle=2&highwayEfficiency=21.0';

                    $res = $client->request('GET', $url, []);

                    $positions = [];
                    $points = json_decode(str_replace([');', 'renderAdvancedNarrative('], '', $res->getBody()), true)['route']['shape']['shapePoints'];
                    for ($i = 0; $i < count($points); $i += 2) {
                        $positions[] = ['lat' => $points[$i], 'lon' => $points[$i + 1]];
                    }


                    $nextPosition = array_shift($positions);

                    $data->position = $position;
                    $data->immobilizer = 'unlocked';
                    $data->ignition = 'off';
                    $data->central_lock = 'unlocked';
                    $data->speed = '0';
                    $data->voltage = '0';
                    $data->doors = 'closed';
                    $data->lights = 'off';
                    $data->handbrake = 'locked';

                    $data->reasons = ['central_lock_changed', 'immobilizer_changed'];
                    $memcached->set($scenario . '::switchIgnition', 'switch_on');

                }
            } else {

                $timeToNextPosition = 0;

                while (true && count($positions) && !$memcached->get($scenario . '::finished')) {
                    $currentPosition = $memcached->get($scenario . '::currentPosition');
                    $nextPosition = array_shift($positions);

                    $distance = $this->calculateDistance($currentPosition['lat'], $currentPosition['lon'], $nextPosition['lat'], $nextPosition['lon'], 'K');

                    $memcached->set($scenario . '::currentPosition', $nextPosition);
                    $memcached->set($scenario . '::positions', $positions);

                    $position->lat = $nextPosition['lat'];
                    $position->lon = $nextPosition['lon'];
                    $data->position = $position;
                    $data->immobilizer = 'unlocked';
                    $data->ignition = 'on';
                    $data->central_lock = 'unlocked';
                    $data->speed = rand(5, 100);
                    $data->voltage = '0';
                    $data->doors = 'closed';
                    $data->lights = 'on';
                    $data->handbrake = 'unlocked';

                    $data->reasons = ['moved'];


                    $sleep = ($distance / (300 / 60 / 60));
                    $timeToNextPosition += $sleep;

                    if ($timeToNextPosition < 1) {
                        continue;
                    } else {
                        sleep((int)$timeToNextPosition);
                        break;
                    }
                }

                if (!count($positions)) {
                    sleep(5);
                    $data->position = $position;
                    $data->immobilizer = 'locked';
                    $data->ignition = 'off';
                    $data->central_lock = 'locked';
                    $data->speed = '0';
                    $data->voltage = '0';
                    $data->doors = 'closed';
                    $data->lights = 'off';
                    $data->handbrake = rand(1, 2) == 1 ? 'unlocked' : 'locked';

                    $data->reasons = ['central_lock_changed', 'immobilizer_changed'];

                    $memcached->set($scenario . '::finished', true);
                }
            }
        }
        $data->fuel_level = $fuel_level - (rand(1, 10) / 20);
        $data->mileage = $mileage + (rand(1, 10) / 100);

        $position->lat = $nextPosition['lat'];
        $position->lon = $nextPosition['lon'];

        $memcached->set($scenario . '::fuel_level', $data->fuel_level);
        $memcached->set($scenario . '::mileage', $data->mileage);

        $memcached->set($scenario . '::currentPosition', $nextPosition);
        $memcached->set($scenario . '::positions', $positions);

        return new JsonResponse($data);
    }

    protected
    function calculateDistance($lat1, $lon1, $lat2, $lon2, $unit)
    {
        $theta = $lon1 - $lon2;
        $dist = sin(deg2rad($lat1)) * sin(deg2rad($lat2)) + cos(deg2rad($lat1)) * cos(deg2rad($lat2)) * cos(deg2rad($theta));
        $dist = acos($dist);
        $dist = rad2deg($dist);
        $miles = $dist * 60 * 1.1515;
        $unit = strtoupper($unit);

        if ($unit == "K") {
            return ($miles * 1.609344);
        } else if ($unit == "N") {
            return ($miles * 0.8684);
        } else {
            return $miles;
        }
    }
}
