from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseServerError
from django.template import RequestContext
import indicoio
import json
from django.conf import settings
from indicoio.custom import Collection

from django.views.generic import TemplateView
from django.views.generic import View

indicoio.config.api_key = settings.INDICO_KEY
collection = Collection(settings.INDICO_MODEL)

def classify(request):
    if not "url" in request.GET:
        return HttpResponseServerError('<h1>Server Error (500)</h1>')
    url = request.GET["url"]
    return JsonResponse(collection.predict(url))

def classifyBatch(request):
    if not "url" in request.POST:
        return HttpResponseServerError('<h1>Server Error (500)</h1>')
    url = request.GET["url"]
    return JsonResponse(collection.predict(url))

class ClassifyView(View):
    def get(self, request, *args, **kwargs):
        if not "url" in request.GET:
            return HttpResponseServerError('<h1>Server Error (500)</h1>')
        url = request.GET["url"]
        return JsonResponse(collection.predict(url))

    def post(self, request, *args, **kwargs):
        print request.POST.viewkeys()
        data = request.POST.getlist('data')
        result = collection.predict(data)
        print type(result)
        response = {}
        for i in range(len(data)):
            response[data[i]] = result[i]
        return JsonResponse(response)

class HomeView(TemplateView):
    template_name = 'home.html'

    def get(self, request, *args, **kwargs):
        context = {};
        context['some_dynamic_value'] = 'Some value'
        if "url" in request.GET:
            url = request.GET["url"]
            result = collection.predict(url)
            context['result'] = result
            context['url'] = url
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        print request.POST.viewitems()
        print dir(request.POST)
        data = request.POST.getlist('data')
        print data
        result = collection.predict(data)
        print type(result)
        context = {}
        context['data'] = []
        for i in range(len(data)):
            context['data'].append(result[i])
        return self.render_to_response(context)
        