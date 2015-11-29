from __future__ import print_function

import sys
import json
import time
from pprint import pprint

from pyspark import SparkContext
from pyspark.streaming import StreamingContext

def mapper(tweet):

     try:
        print(type(tweet))
        jsontweet = json.loads(tweet)
        pprint(jsontweet, width=1)
        return 1

     except:
        print("bad tweet, skipping record...")
        return 0

def analyse(rdd):
    newrdd = rdd.map(mapper) 
    value = newrdd.collect()
    print(value)

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
