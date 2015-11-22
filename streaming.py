from __future__ import absolute_import, print_function

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream

# Go to http://apps.twitter.com and create an app.
# The consumer key and secret will be generated for you after
consumer_key="GwTeJJhsh0vX91IDtc7WkvcVg"
consumer_secret="IBxTMhgHseDuZoRzP8P00o5sQGHwsD0UgSfqPv23YbRFPxQmB9"

# After the step above, you will be redirected to your app's page.
# Create an access token under the the "Your access token" section
access_token="2878544790-6pzBktLkURbaYyTt9y7j9kqwomf7MqkourSUrVN"
access_token_secret="hG2nrG90BicwhU5NgJk9M6V5pB7cIED7mZKJbHYGEowOF"

class StdOutListener(StreamListener):
    """ A listener handles tweets that are received from the stream.
    This is a basic listener that just prints received tweets to stdout.

    """
    def on_data(self, data):
        print(data)
        return True

    def on_error(self, status):
        print(status)

if __name__ == '__main__':
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)

    stream = Stream(auth, l)
    stream.filter(track=['#TheFaceThailandseason2'])
