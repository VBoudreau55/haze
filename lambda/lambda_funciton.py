import json
import boto3
import traceback 
from botocore.exceptions import ClientError
from decimal import Decimal
from boto3.dynamodb.conditions import Key
from api_processing import ApiProcessing

# Initialize the DynamoDB client
dynamodb = boto3.resource('dynamodb', region_name='us-east-1')
dynamodb_table = dynamodb.Table('user_info')

# Define API Paths
root_path = '/api_processing'
status_check_path = root_path + '/status'
country_path = root_path + '/country'
user_path = root_path + '/user'  # FIXED

def lambda_handler(event, context):
    try:
        print('Event:', json.dumps(event, indent=2))
        response = None

        # Extract HTTP method and path
        http_method = event.get('httpMethod', '')
        path = event.get('resource', '')

        # Debug the values
        print('HTTP Method:', http_method)
        print('Path:', path)

        if http_method == 'GET' and path == status_check_path:
            response = build_response(200, {'message':'Service is operational'})
        elif http_method == 'GET' and path == country_path:
            response = get_country(4)
        elif http_method == 'GET' and path == user_path:
            user_id = event.get('queryStringParameters', {}).get('user_id')
            if user_id:
                response = get_user(user_id)
            else:
                response = build_response(400, 'Missing user_id parameter')
        elif http_method == 'POST' and path == user_path:
            response = save_user(json.loads(event.get('body', '{}')))
        elif http_method == 'PATCH' and path == user_path:
            body = json.loads(event.get('body', '{}'))
            response = modify_user(body.get('userid'), body.get('updateKey'), body.get('updateValue'))
        elif http_method == 'DELETE' and path == user_path:
            body = json.loads(event.get('body', '{}'))
            response = delete_user(body.get('userid'))
        else:
            response = build_response(404, '404 Not Found')

    except Exception as e:
        print('Error:', str(e))  # Print the error message
        traceback.print_exc()  # Print the stack trace for debugging
        response = build_response(500, f'Internal Server Error: {e}') 

    return response

def get_country(country_id):
    try:
        api_processing = ApiProcessing()  # Create an instance of ApiProcessing
        result = api_processing.process()  # Call the process method or whatever functionality you need
        return build_response(200, result)
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def get_user(user_id):
    try:
        response = dynamodb_table.get_item(Key={'userid': user_id})
        return build_response(200, response.get('Item', {}))  # Avoid returning None
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def save_user(request_body):
    try:
        dynamodb_table.put_item(Item=request_body)
        return build_response(200, {'Operation': 'SAVE', 'Message': 'SUCCESS', 'Item': request_body})
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def modify_user(user_id, update_key, update_value):
    try:
        response = dynamodb_table.update_item(
            Key={'userid': user_id},
            UpdateExpression=f'SET {update_key} = :value',
            ExpressionAttributeValues={':value': update_value},
            ReturnValues='UPDATED_NEW'
        )
        return build_response(200, {'Operation': 'UPDATE', 'Message': 'SUCCESS', 'UpdatedAttributes': response})
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

def delete_user(user_id):
    try:
        response = dynamodb_table.delete_item(
            Key={'userid': user_id},
            ReturnValues='ALL_OLD'
        )
        return build_response(200, {'Operation': 'DELETE', 'Message': 'SUCCESS', 'Item': response})
    except ClientError as e:
        print('Error:', e)
        return build_response(400, e.response['Error']['Message'])

class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return int(obj) if obj % 1 == 0 else float(obj)
        return super(DecimalEncoder, self).default(obj)

def build_response(status_code, body):
    return {
        'statusCode': status_code,
        'headers': {
            'Content-Type': 'application/json'
            },
        'body': json.dumps(body, cls=DecimalEncoder)
    }
