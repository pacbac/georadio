from django import template
from decouple import config

register = template.Library()

@register.simple_tag
def maps_api_key():
    return config('MAPS_KEY')
