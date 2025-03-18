# api_processing.py
import requests
import pycountry
import csv
import io
from datetime import datetime

from keys import Nasa_API_Key
from keys import OPEN_AQ_API_KEY

class ApiProcessing:
    def __init__(self):
        # Initialization if needed
        pass

    def get_country_list(self):
        # Logic for processing
        return "api processing"

    def get_country(self, country_id):
        country = pycountry.countries.get(alpha_2=country_id)
        alpha3_id = country.alpha_3
        output = {}
        #output['oaq'] = self.process_oaq_api(country_id)
        output['nasa'] = self.process_nasa_api(alpha3_id)
        return output
    
    def get_current_location(self, lat, long, radius=25000):
        output = {}
        output['oaq'] = self.process_oaq_loc_api(lat, long, radius)
        return output
    
    
    def process_oaq_loc_api(self, lat, long, radius):
        print(radius)
        location_query = f"https://api.openaq.org/v3/locations?coordinates={lat}%2C%20{long}&radius={radius}&limit=100&page=1&order_by=id&sort_order=asc"
        
        headers = {'X-API-Key': OPEN_AQ_API_KEY}
        get_location = requests.get(location_query, headers=headers).json()

        sensor_info = {}
        for sensor in get_location['results']:
            id = sensor['id']
            lat = sensor['coordinates']['latitude']
            long = sensor['coordinates']['longitude']
            sensor_daily_query =f"https://api.openaq.org/v3/sensors/{id}/measurements/daily?limit=100&page=1"
            get_sensor_data = requests.get(sensor_daily_query, headers=headers).json()

            for data in get_sensor_data['results']:
                data['summary']['lat'] = lat
                data['summary']['long'] = long
                sensor_info[id] = data['summary']

        return sensor_info
    
    def process_oaq_api(self, openaq_code):
        dynamodb_country_table = dynamodb.Table('oaq_country')
        response = dynamodb_country_table.get_item(Key={'id': openaq_code})
        oaq_id = response["Item"].get("oaq_id")
        country_query = f"https://api.openaq.org/v3/countries/{oaq_id}"
        headers = {'X-API-Key': OPEN_AQ_API_KEY}
        get_country = requests.get(country_query, headers=headers).json()

        return get_country

    def process_nasa_api(self, country_id):
        today = datetime.today().strftime('%Y-%m-%d')
        Nasa_API = f"https://firms.modaps.eosdis.nasa.gov/api/country/csv/{Nasa_API_Key}/VIIRS_SNPP_NRT/{country_id}/1/{today}"

        try:
            # Fetch the CSV data
            response = requests.get(Nasa_API)
            response.raise_for_status()  # Raise an error for failed requests

            # Read CSV content
            csv_data = response.text
            csv_reader = csv.DictReader(io.StringIO(csv_data))

            # Process the data
            fire_data = []
            total_frp = 0
            total_brightness = 0
            daycount = 0
            nightcount = 0
            fire_count = 0

            for row in csv_reader:
                fire_count += 1
                lat = float(row["latitude"])
                lon = float(row["longitude"])
                total_frp += float(row["frp"])
                total_brightness += float(row["bright_ti5"])
                daycount += 1 if row["daynight"] == "D" else 0
                nightcount += 1 if row["daynight"] == "N" else 0

                # Append fire details
                fire_data.append({
                    "latitude": lat,
                    "longitude": lon,
                    "brightness": float(row["bright_ti5"]),
                    "frp": float(row["frp"]),
                })

            # Calculate statistics
            avg_frp = total_frp / fire_count if fire_count > 0 else 0
            avg_brightness = total_brightness / fire_count if fire_count > 0 else 0

            # Generate JSON output
            output = {
                "total_fires": fire_count,
                "total_day_fires": daycount,
                "total_night_fires": nightcount,
                "average_frp": avg_frp,
                "average_brightness": avg_brightness,
                "fire_data": fire_data
            }
            return output
        except requests.RequestException as e:
            return f"Error: {e}"
    