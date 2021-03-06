"""drinks URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/1.10/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  url(r'^$', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  url(r'^$', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.conf.urls import url, include
    2. Add a URL to urlpatterns:  url(r'^blog/', include('blog.urls'))
"""
from django.conf.urls import url
from drinksapp import views

from django.contrib import admin
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', views.HomeView.as_view(), name='index'),
    url(r'^classify/$', views.ClassifyView.as_view(), name='classify'),
    url(r'^privacy/$', views.PrivacyView.as_view(), name='privacy'),
    url(r'^about/$', views.AboutView.as_view(), name='about'),
    url(r'^submissions/$', views.SubmissionView.as_view(), name='submissionview'),
    #url(r'^submissions/create$', views.SubmissionCreate.as_view(success_url="/submissions"), name='submissionview'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
