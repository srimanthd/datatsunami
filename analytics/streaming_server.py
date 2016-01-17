####################################
# File name: streaming_server.py   #
# Author: Srimanth Duggineni       #
# Submission: 12/1/2015            #
####################################

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import socket
import sys
import time

timestamp = time.time()

ts = open("time.stamp","w")
ts.write(repr(timestamp))
ts.close()

tweetcount = 0
HOST = ''
PORT = 5053
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
server.bind((HOST, PORT))

server.listen(1)
conn, addr = server.accept()

class TsunamiListener(StreamListener):
    
    def on_data(self,data):
        global tweetcount;
        tweetcount +=1
        fw = open('count','w')
        fw.write(str(tweetcount))
        fw.close()
#        print(data)
        print("sending.....: %s" %tweetcount)
        conn.send(data.encode('utf-8'))

        if(tweetcount==trackcount):
            conn.close()
            sys.exit("Recieved max count")
        
        return True

    def on_error(self,status):
        print(status)
    
def loadcredentials():
    
    credentials = open('/home/srimanth/credentials').read().split('\n') 
    return credentials

if __name__ == '__main__':    

#    credentials = loadcredentials()
    trackterm = sys.argv[1].split(",")[0]
    trackcount = int(sys.argv[1].split(",")[1])
    tweetlistener = TsunamiListener()
    auth_details = OAuthHandler("g0hcFNpNOKqqZRNc6GgNND2Ee","505rDlDwOemdA59yhGvZXFW7ghYDGIjJT02OVCeyK0bDWSB3Fn")
    auth_details.set_access_token("2878544790-6pzBktLkURbaYyTt9y7j9kqwomf7MqkourSUrVN","hG2nrG90BicwhU5NgJk9M6V5pB7cIED7mZKJbHYGEowOF")
    
    tweetstream = Stream(auth_details, tweetlistener)
    tweetstream.filter(track=[trackterm])
#    tweetstream.sample()