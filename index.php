<?php

header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, X-Requested-With");
header("Content-Type: application/json");
include "db.php";
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

function getcity($data, $conn)
{
    $json = file_get_contents("city.json");
    // $sql = "Select * from city_list order by city";
    // $result = $conn->query($sql);
    // if ($result->num_rows > 0) {
    //     while ($row = $result->fetch_assoc()) {
    //         array_push($json, $row);
    //     }
    // }
    return (json_encode($json));
}
// function getrecommendations($data, $conn)
// {
//     $json = [];
//     $sql = "Select * from aqi_recommendations where aqi_level = '" . $data["aqi_level"] . "' and group_type = '" . $data["group_type"] . "'";
//     $result = $conn->query($sql);
//     if ($result->num_rows > 0) {
//         while ($row = $result->fetch_assoc()) {
//             array_push($json, $row);
//         }
//     }
//     return (json_encode($json));
// }
function getDoc($data, $conn)
{
    $json = [];
    $sql = "Select * from nearby_list where Type = 'Doctor' and city = '" . $data["city"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($json, $row);
        }
    }
    return (json_encode($json));
}
function getPharmacy($data, $conn)
{
    $json = [];
    $sql = "Select * from nearby_list where Type = 'Pharmacy' and city = '" . $data["city"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($json, $row);
        }
    }
    return (json_encode($json));
}

function insercode($data, $conn)
{
    $json = [];
    $sql = "Select * from coupons where  code = '" . $data["code"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        $tp = json_decode($data["deviceInfo"],true);
    //    print_r($tp);

       $sql2 = "INSERT into coupon_history (coupon,deviceinfo,uuid) values ('" . $data["code"] . "','" . $data["deviceInfo"] . "','" . $tp["uuid"] . "')";
       $result1 = $conn->query($sql2);
       if($result1){
           return ('{"status":"success"}');
       }else{
        return ('{"status":"error","message":"Invalid Coupon Code"}');
       }

    }else{
        return ('{"status":"error","message":"Invalid Coupon Code"}');
    }
    // return (json_encode($json));
}

function getaqinotification($data, $conn)
{
    $json = [];
    $sql = "Select distinct notification_text from aqi_notifications where aqi_level = '" . $data["aqi_level"] . "' and group_type = '" . $data["group_type"] . "'";
    $result = $conn->query($sql);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($json, $row);
        }
    }
    return (json_encode($json));
}

function getallergynotification($data, $conn)
{
    $json = [];
    $allergycondition =  $data['allergydata'];
    $sql = "Select distinct allergy_text from allergy_notifications where allergy_type in (" . $allergycondition . ")";
    // echo $sql;
    $result = $conn->query($sql);
    // print_r($result);
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            array_push($json, $row);
        }
    }
    return (json_encode($json));
}

function store_data_range($data, $conn)
    {
        // print_r($data['signupData']['latitude']);exit;
        $data1 = [
            'lat' => $data['signupData']['latitude'],
            'lng' => $data['signupData']['longitude']
        ];
        $wheather_info = json_decode(weather_data($data1, $conn), true);
        // print_r($wheather_info);exit;
        $json = [];
        $enddate = date("Y-m-d");
        $sql1 = "SELECT * FROM allergyn_rate WHERE deviceId = '".  $data['deviceId'] ."' and loc = '". $data['loc'] ."' and type = '". $data['type'] ."' and time_date LIKE '%". $enddate ."%'";
        // echo $sql1;exit;
        $result1 = $conn->query($sql1);
        $row = $result1->fetch_assoc();
        // print_r($row);
        // print_r(sizeof($row));
        // exit;
        if(isset($row))
        {
            $sql = "UPDATE allergyn_rate SET rate = '". $data['rate'] ."', aqi_value = '". $wheather_info['data']['aqi'] ."', pollen_value = '". $wheather_info['data']['pollen_value'] ."' WHERE deviceId = '".  $data['deviceId'] ."' and loc = '". $data['loc'] ."' and type = '". $data['type'] ."' and  DATE(time_date) = '". $data['date'] ."'";
        }
        else
        {
            $sql = "INSERT INTO `allergyn_rate`(`rate`, `type`, `loc`,`aqi_value`,`pollen_value`, `deviceId`,`time_date`) VALUES ('". $data['rate'] ."', '". $data['type'] ."','". $data['loc'] ."', '". $wheather_info['data']['aqi'] ."', '". $wheather_info['data']['pollen_value'] ."', '". $data['deviceId'] ."','". date("Y-m-d H:i:s") ."')";
        }
        // print_r($sql);exit;
        $result = $conn->query($sql);
        // print_r($result);exit;
        array_push($json, "success");
        return (json_encode($json));
    }


    function show_graph($data, $conn)
    {
        $json = [];
        $new_arra = array();
        $startdate = $data['selectedRange']['from'];
        $enddate = date("Y-m-d", strtotime($data['selectedRange']['to'] . ' +1 day'));
        $sql = "SELECT deviceId, CAST(time_date AS DATE) AS date, 
                   MAX(CASE WHEN type = 'Nasal' THEN rate END) AS Nasal, 
                   MAX(CASE WHEN type = 'Occular' THEN rate END) AS Occular,
                   MAX(aqi_value) AS aqi_value,
                   MAX(pollen_value) AS pollen_value
            FROM allergyn_rate 
            WHERE (time_date BETWEEN '". $startdate ."' AND '". $enddate ."') 
              AND deviceId = '".$data['deviceId']."' 
              AND loc = 'M' 
            GROUP BY deviceId, CAST(time_date AS DATE) 
            ORDER BY CAST(time_date AS DATE) ASC;";
        $result = $conn->query($sql);
        $i = 0;
        while ($row = $result->fetch_assoc()) {
            $new_arra['occcular'][] = (int)$row['Occular'];
            $new_arra['Nasal'][] = (int)$row['Nasal'];
            $new_arra['aqi'][] = (int)$row['aqi_value'];
            $new_arra['pollen'][] = (int)$row['pollen_value'];
            $new_arra['day'][] = date("D", strtotime($row['date']));
            $i++;
        }
        $new_arra['date_range'] = date("M d",strtotime("-7 Days"))."-".date("d, Y");
        return (json_encode($new_arra));
    }

function weather_data($data, $conn)
{
		// if($data = json_decode(file_get_contents('php://input'), true)){
			$lat = array_key_exists("lat",$data) ? $data['lat'] : false;
			$lng = array_key_exists("lng",$data) ? $data['lng'] : false;
			// print_r($data);exit;
			if($lat && $lng){
				$curl = curl_init();
				curl_setopt_array($curl, [
					CURLOPT_URL => "http://api.openweathermap.org/data/2.5/weather?lat=".$lat."&lon=".$lng."&appid=4542a81fa0c27e7df347e432df2cd809",
					CURLOPT_RETURNTRANSFER => true,
					CURLOPT_ENCODING => "",
					CURLOPT_MAXREDIRS => 10,
					CURLOPT_TIMEOUT => 30,
					CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
					CURLOPT_CUSTOMREQUEST => "POST",
					CURLOPT_HTTPHEADER => [
						"Content-type: application/json"
					],
				]);
				$curl_response = json_decode(curl_exec($curl),true);
				$err = curl_error($curl);
				curl_close($curl);
				if ($err) {
					$response['status'] = false;
					$response['status_code'] = 201;
					$response['message'] = $err;
				} else {
					$response['status'] = true;
					$response['status_code'] = 200;
					$response['message'] = "Success";
					$response['data'] = calculate_aqi($lat,$lng);
					
					$response['data']['description'] = $curl_response['weather'][0]['description'];
					$response['data']['icon'] = "https://openweathermap.org/img/wn/".$curl_response['weather'][0]['icon']."@2x.png";
					$response['data']['temp'] = round($curl_response['main']['temp']-273.15)."°C";
					$response['data']['humidity'] = $curl_response['main']['humidity']."%";
					$response['data']['pressure'] = $curl_response['main']['pressure']."hPa";
					$response['data']['wind_speed'] = round($curl_response['wind']['speed'])."m/s";
					$response['data']['wind_deg'] = $curl_response['wind']['deg']."°";
					$response['data']['wind_gust'] = array_key_exists("gust",$curl_response['wind']) ? round($curl_response['wind']['gust'])."m/s" : 0;
					$response['data']['sunrise'] = $curl_response['sys']['sunrise'];
					$response['data']['sunset'] = $curl_response['sys']['sunset'];
					
				}
			}else{
				$response['status'] = false;
				$response['status_code'] = 201;
				$response['message'] = "Invalid format!";
			}

		// }else{
		// 	$response['status'] = false;
		// 	$response['status_code'] = 201;
		// 	$response['message'] = "Invalid format!";
		// }
		return json_encode($response);
	}

    function calculate_aqi($lat,$lng)
    {
        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.ambeedata.com/latest/by-lat-lng?lat='.$lat.'&lng='.$lng,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "Content-type: application/json",
                "x-api-key: 3ddd5507b47ee90cb01de64a0e8f3eb7283557bc812cd247f333e882fab31c01"
            ],
        ]);

        $cust = json_decode(curl_exec($curl),true);
        $err = curl_error($curl);
        curl_close($curl);
        $data['aqi'] = $cust['stations'][0]['AQI'];
        if(($data['aqi'] >= 0) && ($data['aqi'] <= 50)) $data['aqi_text'] = "Good";
        elseif(($data['aqi'] >= 51) && ($data['aqi'] <= 100)) $data['aqi_text'] = "Moderate";
        elseif(($data['aqi'] >= 101) && ($data['aqi'] <= 150)) $data['aqi_text'] = "Unhealthy for Sensitive Groups";
        elseif(($data['aqi'] >= 151) && ($data['aqi'] <= 200)) $data['aqi_text'] = "Unhealthy";
        elseif(($data['aqi'] >= 201) && ($data['aqi'] <= 300)) $data['aqi_text'] = "Very Unhealthy";
        else $data['aqi_text'] = "Hazardous";

        if(($data['aqi'] >= 0) && ($data['aqi'] <= 50)) $data['aqi_reco_level'] = "0 - 50";
        elseif(($data['aqi'] >= 51) && ($data['aqi'] <= 100)) $data['aqi_reco_level'] = "51 - 100";
        elseif(($data['aqi'] >= 101) && ($data['aqi'] <= 150)) $data['aqi_reco_level'] = "101 - 150";
        elseif(($data['aqi'] >= 151) && ($data['aqi'] <= 200)) $data['aqi_reco_level'] = "151 - 200";
        elseif(($data['aqi'] >= 201) && ($data['aqi'] <= 300)) $data['aqi_reco_level'] = "201 - 300";
        else $data['aqi_reco_level'] = "301 - 500";


        if(($data['aqi'] >= 0) && ($data['aqi'] <= 50)) $data['col1Color'] = "#94cc5d";
        elseif(($data['aqi'] >= 51) && ($data['aqi'] <= 100)) $data['col1Color'] = "#ffca3f";
        elseif(($data['aqi'] >= 101) && ($data['aqi'] <= 200)) $data['col1Color'] = "#c83d1d";
        elseif(($data['aqi'] >= 201) && ($data['aqi'] <= 300)) $data['col1Color'] = "#cf2182";
        elseif(($data['aqi'] >= 301) && ($data['aqi'] <= 400)) $data['col1Color'] = "#5f0d46";
        else $data['col1Color'] = "#d31005";

        if(($data['aqi'] >= 0) && ($data['aqi'] <= 50)) $data['col2Color'] = "#E6FFCE";
        elseif(($data['aqi'] >= 51) && ($data['aqi'] <= 100)) $data['col2Color'] = "#fff3d3";
        elseif(($data['aqi'] >= 101) && ($data['aqi'] <= 200)) $data['col2Color'] = "#ffb7a7";
        elseif(($data['aqi'] >= 201) && ($data['aqi'] <= 300)) $data['col2Color'] = "#ffbbe1";
        elseif(($data['aqi'] >= 301) && ($data['aqi'] <= 400)) $data['col2Color'] = "#ffa5e3";
        else $data['col2Color'] = "#ffa9a5";

        if(($data['aqi'] >= 0) && ($data['aqi'] <= 50)) $data['aqi_text_image'] = "Minimal health impact. No restrictions on outdoor activities. Continue maintaining a healthy lifestyle.";
        elseif(($data['aqi'] >= 51) && ($data['aqi'] <= 100)) $data['aqi_text_image'] = "Acceptable air quality. No adverse effects expected.<br>You may engage in outdoor activities freely. Continue maintaining a healthy lifestyle.";
        elseif(($data['aqi'] >= 101) && ($data['aqi'] <= 150)) $data['aqi_text_image'] = "Worsen the health condition of high risk people who is the people with heart and lung complications.<br>Limited outdoor activities for the high risk people. Public need to reduce the extreme outdoor activities.";
        elseif(($data['aqi'] >= 151) && ($data['aqi'] <= 200)) $data['aqi_text_image'] = "Increased health risks, especially for sensitive groups.<br>Elderly and high-risk individuals should remain indoors and avoid physical exertion.<br>Medical consultation advised for those with existing health issues.";
        elseif(($data['aqi'] >= 201) && ($data['aqi'] <= 300)) $data['aqi_text_image'] = "Hazardous to health. High-risk individuals must stay indoors.<br>You are advised to prevent from outdoor activities";
        else $data['aqi_text_image'] = "Hazardous to high risk people and public health.<br>You are advised to follow orders from National Security Council and always follow the announcement in mass media.";



        $curl = curl_init();
        curl_setopt_array($curl, [
            CURLOPT_URL => 'https://api.ambeedata.com/latest/pollen/by-lat-lng?lat='.$lat.'&lng='.$lng,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => [
                "Content-type: application/json",
                "x-api-key: 3ddd5507b47ee90cb01de64a0e8f3eb7283557bc812cd247f333e882fab31c01"
            ],
        ]);
        $response = curl_exec($curl);
        $err = curl_error($curl);
        curl_close($curl);
        $response = json_decode($response,true);
        $data['pollen_value'] = round(($response['data'][0]['Count']['tree_pollen'] + $response['data'][0]['Count']['grass_pollen'] + $response['data'][0]['Count']['weed_pollen']));
        $data['pollen_count'] = $response['data'][0]['Count'];
        $data['pollen_risk'] = $response['data'][0]['Risk'];
        return $data;
    }
    
    function getrecommendations($data, $conn)
    {
        
        $json = [];
        $sql = "Select * from aqi_recommendations where aqi_level='" . $data["aqi_level"]."'";
        // print_r($sql);exit;
        $result = $conn->query($sql);
        // print_r($result);exit;
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($json, $row);
            }
        }
        return (json_encode($json));
        
    }
function signup_user($data, $conn)
    {
      
    $deviceId = $data['deviceId'];
    $selected = $data['selectedRange'];

    $name = $selected['name'];
    $age = $selected['age'];
    // $allergy = $selected['allergy'];
    // $dustAllergy = $selected['dustAllergy'];
    $doctor = $selected['doctor'];
    $agreeTerms = $selected['agreeTerms'] ? 1 : 0;
    $latitude = $selected['latitude'];
    $longitude = $selected['longitude'];
    $dustSubtypes = json_encode($selected['dustSubtypes']);
    $pollenSubtypes = json_encode($selected['pollenSubtypes']);
        

    $sql = "INSERT INTO user_data (
     device_id, name, age,
    doctor_id, agree_terms, latitude, longitude, dust_subtypes, pollen_subtypes
    ) VALUES (
        '$deviceId', '$name', $age,
        '$doctor', $agreeTerms, $latitude, $longitude, '$dustSubtypes', '$pollenSubtypes'
    )";
   
  
    // print_r($sql);exit;
    if ($result = $conn->query($sql)) {
        $response['status'] = true;
        $response['status_code'] = 200;
        $response['message'] = "Data inserted successfully.";
        
        // echo "Data inserted successfully.";
    } else {
        $response['status'] = false;
        $response['status_code'] = 201;
        $response['message'] = "Wrong format";
        // return $response;
    }
    return json_encode($response);
      
       
        
    }

 function updateProfile_user($data, $conn)
{
    // $function = $data['function']; // You missed this in your signup function
    $deviceId = $data['deviceId'];
    $selected = $data['profileData'];

    $name = $selected['name'];
    $age = (int)$selected['age'];
    // $allergy = $selected['allergy'];
    // $dustAllergy = $selected['dustAllergy'];
    $doctor = $selected['doctor'];
    $agreeTerms = $selected['agreeTerms'] ? 1 : 0;
    $latitude = (float)$selected['latitude'];
    $longitude = (float)$selected['longitude'];
    $dustSubtypes = json_encode($selected['dustSubtypes']);
    $pollenSubtypes = json_encode($selected['pollenSubtypes']);

    $sql = "UPDATE user_data SET 
        name = '$name',
        age = $age,
        doctor_id = '$doctor',
        agree_terms = $agreeTerms,
        latitude = $latitude,
        longitude = $longitude,
        dust_subtypes = '$dustSubtypes',
        pollen_subtypes = '$pollenSubtypes'
        WHERE device_id = '$deviceId'";

    if ($result = $conn->query($sql)) {
        $response['status'] = true;
        $response['status_code'] = 200;
        $response['message'] = "Data Updated successfully.";
    } else {
        $response['status'] = false;
        $response['status_code'] = 201;
        $response['message'] = "Invalid Format.";
    }
    return json_encode($response);
}
function get_doctors($data, $conn)
    {
        // print_r(json_encode($data));exit;
        $json = [];
        $sql = "SELECT * FROM dr_list WHERE TRIM(country) = 'Malaysia' ORDER BY name ASC";
        // echo $sql1;exit;
        $result = $conn->query($sql);
        if ($result->num_rows > 0) {
            while ($row = $result->fetch_assoc()) {
                array_push($json, $row);
            }
        }
        // print_r($result1);exit;
        // print_r(sizeof($row));
        // exit;
     
        return (json_encode($json));
    }

   

    

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $data = json_decode(file_get_contents('php://input'), true);
    if (!isset($data['function']) || !function_exists($data['function'])) {
        echo json_encode(['error' => 'Invalid function']);
        exit;
    }
    try {
        echo $data['function']($data, $conn);
    } catch (Exception $e) {
        echo json_encode(['error' => 'Internal server error']);
    }
} else {
    echo json_encode(['error' => 'Invalid Request']);
}
