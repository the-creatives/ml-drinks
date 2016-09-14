from django.http import HttpResponse
from django.http import JsonResponse
import indicoio
import secrets
from indicoio.custom import Collection

indicoio.config.api_key = secrets.INDICO_KEY
collection = Collection(secrets.INDICO_MODEL)

def classify(request):
	url = request.GET["url"]
	return JsonResponse(collection.predict(url))

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")