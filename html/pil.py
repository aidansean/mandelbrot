import math
from PIL import Image
from mpmath import mp, mpf
print mp

w =  9930
h = 14040


Cx = -1.0070953093035822
Cy = -0.31056180562510205
Dr = 0.00000564503

Cx = -0.7
Cy =  0.0
Dr =  5.0

class color_stop_object:
    def __init__(self, f, r, g, b):
        self.f = f
        self.r = r
        self.g = g
        self.b = b

class palette_object:
    def __init__(self, name):
        self.name = name
        self.color_stops = []   
    def add_color_stop(self, stop):
        self.color_stops.append(stop)
    def get_rgb(self, f):
        color = 'rgb(0,0,0)'
        if len(self.color_stops)<2:
            return color
        for i in range(0,len(self.color_stops)):
            s1 = self.color_stops[i+0]
            s2 = self.color_stops[i+1]
            if f<s1.f or f>s2.f:
                continue
            d = (f-s1.f)/(s2.f-s1.f)
            r = int(s1.r + d*(s2.r-s1.r))
            g = int(s1.g + d*(s2.g-s1.g))
            b = int(s1.b + d*(s2.b-s1.b))
            rgb = (r,g,b)
            return rgb

palette = palette_object('Rainbow')
palette.add_color_stop(color_stop_object(0.0/6.0,   0,   0,   0))
palette.add_color_stop(color_stop_object(1.0/6.0, 255,   0, 255))
palette.add_color_stop(color_stop_object(2.0/6.0,   0,   0, 255))
palette.add_color_stop(color_stop_object(3.0/6.0,   0, 255,   0))
palette.add_color_stop(color_stop_object(4.0/6.0, 255, 255,   0))
palette.add_color_stop(color_stop_object(5.0/6.0, 255,   0,   0))
palette.add_color_stop(color_stop_object(6.0/6.0,   0,   0,   0))

Jx = -1.2571054631848846
Jy =  0.37925715935108123
Dr = 6.96917695473251e-7
Cx = 0
Cy = 0

w = 200
h = 200

img = Image.new( 'RGB', (w,h), 'black') # create a new black image
pixels = img.load() # create the pixel map

max_size = max(w,h)
Dx = Dr*w/max_size
Dy = Dr*h/max_size
iMax = 2500
palette_frequency = 17

for u in range(img.size[0]):    # for every pixel:
    x = Cx - 0.5*Dx + Dx*u/img.size[0]
    if u%1==0:
        print '%4d / %6d (%5.1f%%)'%(u , img.size[0], 100.0*u/img.size[0])
        #print locals()
    for v in range(img.size[1]):
        y = Cy - 0.5*Dy + Dy*v/img.size[1]
        
        if u%1==0 and v%1==0:
            #print '%4d x %4d / %6d (%5.1f%%)'%(u, v, img.size[0], 100.0*u/img.size[0])
            pass
        
        #x1 = mpf(x )
        #y1 = mpf(y )
        #x2 = mpf(x )
        #y2 = mpf(y )
        #x0 = mpf(Jx)
        #y0 = mpf(Jy)
        
        x1 = x
        y1 = y
        x2 = x
        y2 = y
        x0 = Jx
        y0 = Jy
        i = 0
        while i < iMax:
          x2 = x0 + x1*x1 - y1*y1
          y2 = y0 + 2*x1*y1
          x1 = x2
          y1 = y2
          if x2*x2+y2*y2>4e12:
            break
          i += 1

        modZ2 = x2*x2+y2*y2
        nu = 1
        if modZ2 > 1:
            nu = math.log(0.5*math.log(modZ2)/math.log(2))/math.log(2)
        aai = iMax if i>=iMax else i+1-nu
        f = aai/iMax
        
        g = f*palette_frequency
        f = g%1 if math.floor(g)%2==0 else 1-g%1 ;
        rgb = palette.get_rgb(f)
        pixels[u,v] = rgb # set the colour accordingly

img.save('PIL.bmp')

