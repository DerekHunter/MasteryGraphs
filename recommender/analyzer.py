

dataFile = open("masteryData.txt");
data = list(dataFile);
dataFile.close();

data = map(lambda x: x.strip("\n").split(","), data)
header = data[0]
data = data[1:]
outFile = open("outFile.csv", 'w');
outFile.write(",".join(header)+"\n")
outFile.close();

print(len(data[0]))
for baseChampion in range(0, len(data[0])):
	print(baseChampion)
	outFile = open("outFile.csv", 'a');
	for fill in range(0, baseChampion):
		outFile.write("0");
	outFile.close();
	for compareChampion in range(baseChampion, len(data[0])):
		similarity = 0;
		for user in range(0, len(data)):
			similarity += (float(data[user][baseChampion])- float(data[user][compareChampion]))**2
		similarity = similarity**.5
		outFile = open("outFile.csv", 'a');
		outFile.write(str(similarity)+",");
		outFile.close();

	outFile = open("outFile.csv", 'a');
	outFile.write("\n");
	outFile.close();

