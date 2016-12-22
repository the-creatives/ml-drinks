from django.http import HttpResponse
from django.http import JsonResponse
from django.http import HttpResponseServerError
from django.template import RequestContext
from django.conf import settings

from django.views.generic import TemplateView
from django.views.generic import View

from django.utils import http
from django.utils.safestring import mark_safe

import indicoio
import json
import urllib

from indicoio.custom import Collection
from drinksapp.models import Submission

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
        return JsonResponse(collection.predict(http.urlunquote(url)))

    def post(self, request, *args, **kwargs):
        data = request.POST.getlist('data')
        print "Printing data:"
        print data
        print "Printing parsed data:"
        result = collection.predict(data)
        context = {}
        context['list'] = zip(data, result)
        return JsonResponse(context)

class HomeView(TemplateView):
    template_name = 'home.html'

    def get(self, request, *args, **kwargs):
        context = {}

        if "url" in request.GET:
            url = request.GET["url"]
            print url
            Submission.objects.create(url=url)
            result = collection.predict(http.urlunquote(url))
            print "result"
            print result
            context['result'] = result
            context['url'] = url
        return self.render_to_response(context)

    def post(self, request, *args, **kwargs):
        data = json.loads(request.POST.get('data'))
        result = collection.predict(data)
        context = {}
        context['list'] = mark_safe(json.dumps(zip(data, result)))
        return self.render_to_response(context)

class PrivacyView(TemplateView):
    template_name = 'privacy.html'
    def get(self, request, *args, **kwargs):
        context = {}
        return self.render_to_response(context)

class AboutView(TemplateView):
    template_name = 'about.html'
    def get(self, request, *args, **kwargs):
        context = {}
        return self.render_to_response(context)
