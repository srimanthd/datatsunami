####################################
# File name: streaming_server.py   #
# Author: Srimanth Duggineni       #
# Submission: 12/1/2015            #
####################################

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import socket

HOST = ''
PORT = 5007
server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
server.bind((HOST, PORT))

server.listen(1)
conn, addr = server.accept()

class TsunamiListener(StreamListener):
    
    def on_data(self,data):
#        print(data)
        print("sending.....")
        conn.send(data.encode('utf-8'))
        conn.send('\n'.encode('utf-8'))
        
        return True

    def on_error(self,status):
        print(status)
    
def loadcredentials():
    
    credentials = open('/home/srimanth/credentials').read().split('\n') 
    return credentials

if __name__ == '__main__':    

    credentials = loadcredentials()
    tweetlistener = TsunamiListener()
    auth_details = OAuthHandler(credentials[0],credentials[1])
    auth_details.set_access_token(credentials[2],credentials[3])
    
    tweetstream = Stream(auth_details, tweetlistener)
#    tweetstream.filter(track=['#CyberMonday'])
    tweetstream.sample()
