####################################
# File name: network_wordcount.py  #
# Author: Srimanth Duggineni       #
# Submission: 12/1/2015            #
####################################

from __future__ import print_function

import sys
import json
import time
from pprint import pprint
import traceback

from pyspark import SparkContext
from pyspark.streaming import StreamingContext

def mapper(tweet):

     hashtagslist = []
     try:
        jsontweet = json.loads(tweet)
        hashtags =  jsontweet['entities']['hashtags']
#        return (jsontweet['text'].split(" "))
        if(len(hashtags)!=0):
            print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
            for text in hashtags:
                hashtagslist.append(text['text'])
            print("-----------------------------------------------------------------")
            return hashtagslist
        else:
            return ["bad tweet"]

     except:
         traceback.print_exc()
         print("Please look here "+tweet+" Did u see that?")
#        print("bad tweet, skipping record...")
         return ["bad tweet"]

def analyse(rdd):
    count = rdd.flatMap(mapper).map(lambda word: (word, 1)).reduceByKey(lambda a,b: a+b)
    try:
        lst = count.collect()
        slst = sorted(lst,key=lambda x: x[1])
        writer = open("tweets.txt","w")
        writer.write(str(slst))
    except:
        print("Please be patient")

if __name__ == "__main__":

    if len(sys.argv) != 3:
        print("Usage: network_wordcount.py <hostname> <port>", file=sys.stderr)
        exit(-1)
    sc = SparkContext(appName="PythonStreamingNetworkWordCount")
    ssc = StreamingContext(sc, 120)

    lines = ssc.socketTextStream(sys.argv[1], int(sys.argv[2]))
    
    lines.foreachRDD(analyse)
    ssc.start()
    ssc.awaitTermination()
