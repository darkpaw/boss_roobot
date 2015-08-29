
from PIL import Image

im = Image.open("ld33.004.png")

assert isinstance(im, Image.Image)

frames = []

for i in range(4):
    box = (i * 32, 0, i * 32 + 32, 32)
    print("frame", i, box)
    frame = im.crop(box)
    frame.load()
    frames.append(frame)

print("+++++++++++++++++++++++++++++++++++++++++++")

frame = frames[3]
for y in range(32):
    for x in range(32):
        px_data = frame.getpixel((x, y))
        if px_data[3] != 0:  # skip if alpha is zero, pixels will default to 0
            px_idx = (y * 32 + x) * 4
            print('        setpx(%d, RGBA(%d, %d, %d, 255))' % (px_idx, px_data[0], px_data[1], px_data[2]))


