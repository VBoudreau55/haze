"""
This file is just to test the python files locally, to make sure they work before deploying them to AWS Lambda.

This file is not used in the AWS Lambda function.

"""
from api_processing import ApiProcessing

def main():
    api_processor = ApiProcessing()
    country = api_processor.get_country("US")
    #location = api_processor.get_current_location( 37.908743881324625, -121.58020019531251)
    #countries = api_processor.process_oaq_api()
    #print(countries)
    print(f"Country: {country}")
    #print(f"Location: {location}")

if __name__ == "__main__":
    main()