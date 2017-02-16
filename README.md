# ml-drinks

[Drink Detector](https://ml-drinks.herokuapp.com/) recognizes alcohol (bottles, cans, solo cups, etc.) in photographs. [We](https://github.com/the-creatives/) integrated it with Facebook to help individuals flag potentially unflattering images that they're tagged in. Of course, a Facebook image stream is just one of many places the underlying neural network can be used to perform large-scale content filtering. Drink Detector could easily be integrated with any image search service like Shutterstock to help people find what they're looking for, or used to filter an Instagram or Tumblr feed.

Training the underlying neural network was a cinch with indico's [Custom Collections](https://indico.io/product/custom-collections) - it only took us a few hours to start seeing good performance.

How to train an indico Custom Collection for your own image filtering purposes
-----

1. Pick what you want to be filtered. Let's say you want to detect cars.
2. Gather URLs of images and put them into two piles - cars and no cars.
3. Feed these images and categories to your Custom Collection as training data. Here's a [sample iPython notebook](https://github.com/the-creatives/ml-drinks/blob/master/notebooks/Alcohol%20vs%20not%20testing.ipynb) which shows how to do this quickly.
4. Once the neural net is trained, you can feed it a new image and it will tell you whether or not that image contains a car. It will also tell you how sure it is.

Advice in choosing training images
-----
Images on the Internet can vary dramatically. For example, you can have pictures of cars on blank backgrounds, pictures of cars on highways, pictures of cars in cities, pictures of cars at car shows, pictures of cars in home garages, and more. Be sure to provide positive and negative examples of each type of picture. If you put a picture of a car in a city in the "cars" category, be sure to put pictures of cities which don't have cars in the "not cars" category.

<img src="https://fathomless-castle-35327.herokuapp.com/requests/passive">
