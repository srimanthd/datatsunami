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
from collections import Counter
from operator import itemgetter
import pymongo
from pymongo import MongoClient
from bson.objectid import ObjectId

from pyspark import SparkContext
from pyspark.streaming import StreamingContext

finaldict = {}
client = MongoClient('localhost', 27017)
db = client.test
collection = db.GenericCollection

def mapper(tweet):

     hashtagslist = []
     try:
        jsontweet = json.loads(tweet)
        hashtags =  jsontweet['entities']['hashtags']
#        return (jsontweet['text'].split(" "))
        if(len(hashtags)!=0):
            for text in hashtags:
                hashtagslist.append(str(text['text']))
            return hashtagslist
        else:
            return ["bad tweet"]

     except:
#         traceback.print_exc()
         print("Please look here "+tweet+" Did u see that?")
#        print("bad tweet, skipping record...")
         return ["bad tweet"]

def analyse(rdd):
    count = rdd.flatMap(mapper).map(lambda word: (str(word), 1)).reduceByKey(lambda a,b: a+b)
    try:
        global finaldict
        try:
            finaldict.pop('_id')
            print("Popped")
            open("pop","a").write("popped \n")
        except:
            print("cannot pop _id")
        lst = count.collect()
        currentdict = Counter(dict(lst))
        tempfinaldict = Counter(finaldict) 
        finaldict = dict(tempfinaldict+currentdict)
        print("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++")
        sortedlist = sorted( finaldict.items(), key=itemgetter(1) , reverse=True)
        print(sortedlist)
        collection.update_one( {'_id':ObjectId("56781ac704ee3ac8bfe0ff13")}, { "$set": finaldict } )
        print("-----------------------------------------------------------------")
        
        writer = open("tweets.txt","a")
        writer.write(str(sortedlist))
        writer.write('\n')
        writer.close()
    except:
        traceback.print_exc()
        print("Please be patient")

if __name__ == "__main__":

    if len(sys.argv) != 3:
        print("Usage: network_wordcount.py <hostname> <port>", file=sys.stderr)
        exit(-1)
    sc = SparkContext(appName="PythonStreamingNetworkWordCount")
    ssc = StreamingContext(sc, 10)

    lines = ssc.socketTextStream(sys.argv[1], int(sys.argv[2]))
    
    lines.foreachRDD(analyse)
    ssc.start()
    ssc.awaitTermination()
