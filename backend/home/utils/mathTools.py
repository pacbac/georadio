from math import sin, cos, sqrt, atan2, radians

#takes two (lat, long) coordinate pairs and returns the distance in miles from each other
def calcDist(p1, p2):
    # approximate radius of earth in km
    R = 6373.0
    lat1 = radians(p1[0])
    lon1 = radians(p1[1])
    lat2 = radians(p2[0])
    lon2 = radians(p2[1])
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    toMiles = 0.621371
    return R*c*toMiles
