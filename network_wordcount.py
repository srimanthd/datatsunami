from __future__ import print_function

import sys
import json
import time
from pprint import pprint

from pyspark import SparkContext
from pyspark.streaming import StreamingContext

def mapper(tweet):

     try:
        jsontweet = json.loads(tweet)
#        print(jsontweet['entities']['hashtags'][0]['text'])
        return (jsontweet['text'].split(" "))

     except:
#        print("bad tweet, skipping record...")
        return "bad_tweet"

def analyse(rdd):
    count = rdd.flatMap(mapper).map(lambda word: (word, 1)).reduceByKey(lambda a,b: a+b)
    try:
        lst = count.collect()
        print(lst)
    except:
        print("Please be patient")

if __name__ == "__main__":

    if len(sys.argv) != 3:
        print("Usage: network_wordcount.py <hostname> <port>", file=sys.stderr)
        exit(-1)
    sc = SparkContext(appName="PythonStreamingNetworkWordCount")
    ssc = StreamingContext(sc, 3)

    lines = ssc.socketTextStream(sys.argv[1], int(sys.argv[2]))
    
    lines.foreachRDD(analyse)
    ssc.start()
    ssc.awaitTermination()
