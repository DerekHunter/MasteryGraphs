import urllib2

baseUrl = "localhost:3000"
endPoint = "/api/recommender/champion/"
data = ""

if __name__ == '__main__':

	response = urllib2.urlopen(baseUrl + endPoint + data)
	print response.read()