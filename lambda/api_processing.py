# api_processing.py
import requests
import pycountry
import csv
import io
from datetime import datetime

from keys import Nasa_API_Key

class ApiProcessing:
    def __init__(self):
        # Initialization if needed
        pass

    def get_country_list(self):
        # Logic for processing
        return "api processing"

    def get_country(self, country_id):
        #country = pycountry.countries.get(alpha_3=country_id)
        #openaq_code = country.alpha_2
        output = {}
        output['who'] = self.process_who_api(country_id)
        #output['nasa'] = self.process_nasa_api(country_id)

        # Logic for processing
        return output
    
    def get_current_location(self, lat, long):
        # Logic for processing
        return "api processing"
    
    def process_who_api(self, country_id):
        # Logic for processing
        return "api processing"

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
                    "acq_date": row["acq_date"]
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
        


def main():
    api_processor = ApiProcessing()
    country = api_processor.get_country("USA")
    location = api_processor.get_current_location(40.7128, -74.0060)
    print(f"Country: {country}")
    print(f"Location: {location}")

if __name__ == "__main__":
    main()