from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseServerError
import indicoio
from django.conf import settings
from indicoio.custom import Collection

from django.views.generic import TemplateView

indicoio.config.api_key = settings.INDICO_KEY
collection = Collection(settings.INDICO_MODEL)

def classify(request):
	if not "url" in request.GET:
		return HttpResponseServerError('<h1>Server Error (500)</h1>')
	url = request.GET["url"]
	return JsonResponse(collection.predict(url))

class HomeView(TemplateView):
    template_name = 'home.html'

    def get(self, request, *args, **kwargs):
        context = {
            'some_dynamic_value': "Some value",
        }
        return self.render_to_response(context)

def index(request):
    return HttpResponse("Hello, world. You're at the polls index.")