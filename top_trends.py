####################################
# File name: network_wordcount.py  #
# Author: Srimanth Duggineni       #
# Submission: 12/1/2015            #
####################################

from __future__ import print_function

import sys
import json
import time
import traceback
import pymongo

from collections import Counter
from operator import itemgetter
from pymongo import MongoClient
from bson.objectid import ObjectId
from pprint import pprint
from pyspark import SparkContext
from pyspark.streaming import StreamingContext

# scsort = SparkContext(appName="Sorting")
client = MongoClient('localhost', 27017)
db = client.test
collection = db.TwitterTrends
timestamp = time.time()

ts = open("time.stamp","w")
ts.write(repr(timestamp))
ts.close()

def mapper(tweet):

     hashtagslist = []
     try:
        jsontweet = json.loads(tweet)
        hashtags =  jsontweet['entities']['hashtags']

        if(len(hashtags)!=0):

            for text in hashtags:
                hashtagslist.append(str(text['text']))
            return hashtagslist

        else:
            return ["bad tweet"]

     except:
         return ["bad tweet"]


def analyse(rdd):
    count = rdd.flatMap(mapper).map(lambda word: (str(word), 1)).reduceByKey(lambda a,b: a+b)
    isAlive = False

    try:
        listoftuples = count.collect()
        document = { "timestamp": timestamp, "hashtags" : [] }
        document_sort = { "timestamp_sort": timestamp, "hashtags" : [] }
        entries = []

        for onetuple in listoftuples:
            dict = { "name" : onetuple[0], "count" : onetuple[1] }
            entries.append(dict)

        document["hashtags"] = entries

        cursor = collection.find( {  "timestamp" : timestamp } )
        cursor_sort = collection.find( {  "timestamp" : timestamp } )
        cursor_sort_check = collection.find( {  "timestamp_sort" : timestamp } )
        isThere = cursor.count()
        isCheck = cursor_sort_check.count()

        if (isThere!=0):
            for eachhashtag in entries:
                cursor_hashtag = collection.find( { "hashtags.name" : eachhashtag['name'] } )
                isExists = cursor_hashtag.count()
                if (isExists!=0):
                    index = 0 
                    array_hashtags = cursor_hashtag.next()['hashtags']
                    for hashtagdict in array_hashtags:
                        if (hashtagdict['name'] == eachhashtag['name']):
                            indexOfHashtag = index

                    index = index + 1

                    fieldname = "hashtags."+str(indexOfHashtag)+".count"
                    inc_dict = {}
                    inc_dict[fieldname] = eachhashtag['count']
                    collection.update( { "timestamp" : timestamp }, { "$inc" : inc_dict } )
                else:
                    collection.update( { "timestamp" : timestamp }, { "$push" : { "hashtags": eachhashtag } }  ) 
        else:
            collection.insert_one(document)
		
        unsortedlistdicts = cursor_sort.next()['hashtags']
        unsortedrdd = sc.parallelize(unsortedlistdicts)
        sortedrdd = unsortedrdd.sortBy(lambda a: a['count'])
        sortedlistdicts = sortedrdd.collect()
        document_sort["hashtags"] = sortedlistdicts
		
        if(isCheck!=0):
            collection.update( { "timestamp_sort": timestamp }, { "$set" : { "hashtags": sortedlistdicts } } )
        else:
            collection.insert_one(document_sort)

    except Exception as ex:
        traceback.print_exc()
        writer = open('errors.log','a')
        writer.write(str(ex)+"\n")
        writer.close()
        pass


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
