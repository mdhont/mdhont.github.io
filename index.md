---
layout: default
---

### [](#header-3) The strange effect

This effect was originally discovered by my father - Bram Dhont - who as a visual artist was working a lot with Photoshop at the time. He ran a macro on an image which had the following logic:


```
original image -> rotate 0° -> resize 1/2 -> position {top: 0 left: 0}    
original image -> rotate 90° -> resize 1/2 -> position {top: 0 left: originalImageWidth/2}    
original image -> rotate 180° -> resize 1/2 -> position {top: originalImageHeigth/2 left: originalImageWidth/2}    
original image -> rotate 270° -> resize 1/2 -> position {top: 0 left: originalImageWidth/2}   
```

The result of running the script:

|After one round              |After 5 rounds                 | After 10 rounds               |
|![](/images/twistExample.png)|![](/images/twistExample_2.png)|![](/images/twistExample_3.png)|

After five rounds the image contains a lot of tiny sunflowers. After ten rounds the flowers are gone and seem irretrievably lost.  

But, surprise, after twenty five rounds the original image suddenly returns.

|![](/images/twistExample_4.png)|![](/images/twistExample_5.png)|![](/images/twistExample_6.png)|![](/images/twistExample_7.png)|

We were going to have sunflower soup for dinner, so what's up with that?

### [](#header-3) The explanation

I only found out what caused it after reproducing it with PHP and ImageMagick, using a very small image. 

Let's imagine an image with only four pixels:
<table>
<tr>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:black;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>
</td>
</tr>
</table>

Now let's make four copies and rotate them 0°, 90°, 180° and 270° respectively.

<table>
<tr>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:black;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>

</td>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:black;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>

</td>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:black;width:50px;height:50px;">
</td>
</tr>
</table>

</td>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:black;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>
</td>
</tr>
</table>

The default algorithm used to downsize images half the size is an [unscaled interpolation filter](http://www.imagemagick.org/Usage/filter/#point), which eliminates the even numbered rows and columns across the image. So if we resize our four pixel images to half their size the filter would simply take away the first column and the first row of pixels, so the resized images would look like this:

<table>
<tr>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>

</td>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>

</td>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:black;width:50px;height:50px;">
</td>
</tr>
</table>

</td>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
</tr>
</table>
</td>
</tr>
</table>

The last thing we need to do is to put each image in it's place following the scripts logic. Which would result in the following image, which is an inverted version of the original.

<table>
<tr>
<td>
<table style="border:1px;width;100px;height;100px;">
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:black;width:50px;height:50px;">
</td>
</tr>
</table>
</td>
</tr>
</table>

Running the script again will bring back the original image.

When you scale an image to half it's size, the image will have 25% of the original information. But by rotating the image and _then_ resizing it, that 25% will have different information. Each pixel is saved one out of four times so the information is never lost.

### [](#header-3) Do the shuffle

So basically the pixels are being shuffled like a deck of cards and after various iterations they return to their starting point. Different variations are possible.


<div style="float:left;width:100%;">
<div style="float:left;">
<table style="border:1px;width;100px;height;100px;">
<tr>
<td>0
</td>
<td>1
</td>
<td>2
</td>
<td>3
</td>
<td>4
</td>
<td>5
</td>
</tr>
<tr>
<td style="background-color:blue;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:green;width:50px;height:50px;">
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
</tr>
</table>
<p style="width:300px;font-size:14px;">A single line of pixels is rearanged each new line by combining the odd numbered pixels and placing them on the left half and the even numbered pixels on the right half.
</p>
</div>

<div style="float:left; margin-left:50px;">
<table style="border:1px;width;100px;height;100px;">
<tr>
<td>0
</td>
<td>1
</td>
<td>2
</td>
<td>3
</td>
<td>4
</td>
<td>5
</td>
</tr>
<tr>
<td style="background-color:blue;width:50px;height:50px;">
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:purple;width:50px;height:50px;">
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:pink;width:50px;height:50px;">
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:yellow;width:50px;height:50px;">
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:green;width:50px;height:50px;">
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
<td style="background-color:orange;width:50px;height:50px;" >
</td>
</tr>
<tr>
<td style="background-color:orange;width:50px;height:50px;">
</td>
<td style="background-color:green;width:50px;height:50px;" >
</td>
<td style="background-color:purple;width:50px;height:50px;" >
</td>
<td style="background-color:yellow;width:50px;height:50px;" >
</td>
<td style="background-color:pink;width:50px;height:50px;" >
</td>
<td style="background-color:blue;width:50px;height:50px;" >
</td>
</tr>
</table>
<p style="width:300px;font-size:14px;">A single line of pixels is rearanged each new line by placing the right most pixel first, the leftmost pixel second the second right most third, the second left most fourth and keep on moving inwards.
</p>
</div>
</div>
<br>

---

This kind of shuffling can be done for the x and y positions. But to move all those pixels around, another aproach was needed, using Javascript and a canvas element. The following script recalculates each pixel position back or forward, using three different algorithms, clone, mirror and twist, which can be applied to both position and RGB values. If you combine them - for example - back twist -> forward clone etc, it's funny to see how certain patterns emerge. The RGB only works forward and only with clone and mirror.

### [](#header-3)In 3D

Same rules applied to points in a 3D plane. You can move around and zoom in and out using the mouse.
<div id="canvas_holder">
</div>


### [](#header-3)Try for yourself

<p class="flavor">
    <input type="radio" id="clone" name="flav" checked>
    <label for="clone">Clone&nbsp;</label>
    <input type="radio" id="mirror" name="flav">
    <label for="mirror">Mirror&nbsp;</label>
    <input type="radio" id="twist" name="flav">
  <label for="twist">Twist&nbsp;</label>
<p class="type">
    <input type="radio" id="position" name="typ" checked>
    <label for="position">Position&nbsp;</label>
    <input type="radio" id="rgb" name="typ">
    <label for="rgb">RGB&nbsp;</label>
 </p>
   <p class="moveButtons">

   <button class="back">back</button>
   <button class="next">forward</button>
   </p>
   <canvas id="screen" width="300" height="300"></canvas>
