import urllib2, json

baseUrl = "localhost:3000"
endPoint = "/api/recommender/champion/"

if __name__ == '__main__':

	dataFile = open("outFile.csv")
	data = list(dataFile);
	dataFile.close();

	data = map(lambda x: x.strip("\n").split(","), data)
	ids = data[0]
	data = data[1:]
	for x in range(0, len(data)):
		for y in range(0,x):
			data[x][y] = data[y][x]

	for i in range(len(ids)):
		temp = []
		for j in range(len(data[i])):
			if data[i][j] != '':
				temp.append(float(data[i][j]))
		sendData = json.dumps({
			"id": ids[i],
			"data": temp
			})
		print sendData
		
		#req = urllib2.Request(url + ids[i], sendData, {'Content-Type': 'application/json'})
		#print urllib2.urlopen(req).read()