from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseServerError
import indicoio
import settings
from indicoio.custom import Collection

indicoio.config.api_key = settings.INDICO_KEY
collection = Collection(settings.INDICO_MODEL)

def classify(request):
	if not "url" in request.GET:
		return HttpResponseServerError('<h1>Server Error (500)</h1>')
	url = request.GET["url"]
	return JsonResponse(collection.predict(url))

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")