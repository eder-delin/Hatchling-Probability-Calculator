import pandas as pd
import re
import os

"""
ext files:
- header (static)
- tablink blank
- tab code blank
"""
fpath = "."
sheetid = "1tYWIF4Ax5IHF0XQyC8NivGQsOsqiukTbCNCPPEqJqsI"
listen = 1370417660
sortd = 554957834
prefixes = ["m"]
ancients = []
rgxlist = ["[a-z]$"]
btypes = ["Modern"]

rlist = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheetid}/export?gid={listen}&format=csv", usecols=[14, 15], header=None).dropna()
primary = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheetid}/export?gid={sortd}&format=csv", usecols=[0, 1, 2], header=None).dropna()
secondary = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheetid}/export?gid={sortd}&format=csv", usecols=[3, 4, 5], header=None).dropna()
tertiary = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheetid}/export?gid={sortd}&format=csv", usecols=[6, 7, 8], header=None).dropna()
mbreeds = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheetid}/export?gid={sortd}&format=csv", usecols=[9, 10, 11], header=None).dropna()
#colors = pd.read_csv(f"https://docs.google.com/spreadsheets/d/{sheetid}/export?gid={listen}&format=csv", usecols=[0, 1], skiprows = 14, header=None).dropna()

for row in rlist.itertuples():
	tpe = row[1]
	prefix = re.findall("^[A-Za-z]+", row[2])
	if (len(tpe) > 1 and len(prefix) > 0):
		btypes.append(tpe)
		rgxlist.append(row[2])
		prefixes.append(prefix[0].lower())
		ancients.append(prefix[0])
def prlist(glist):
	for el in glist:
		print(el)	

#for row in colors.itertuples():
#	el = "<option value={}>".format(int(row[2])) + row[1] + "</option>"
#	print(el)

##evtl: tablinks mit abkürzung/icon -> erweiterung/hovertext bei interaktion
#load template
#get values
#write header (mode w)

tablink = "\t<button class=\"tablink\" id=\"PREFIX_Tab\" name=\"PREFIX_Tab\">BREEDTYPE</button>"
os.popen("cp "+fpath+"/index.html index-old.html")

with open(fpath+"/index.html", "w") as fout:
	with open("./header.txt", "r") as fhead:
		for line in fhead:
			fout.write(line)
	idx = 0
	for btype in btypes:
		prefix = prefixes[idx]
		line = re.sub("PREFIX", prefix, tablink)
		line = re.sub("BREEDTYPE", btype, line)
		fout.write(line+"\n")
		idx += 1
	fout.write("  </div>\n")
	breedcount = 0
	for rgx in rgxlist:
		breedlist = []
		prilist = []
		seclist= []
		tertlist = []
		spacer = "\t\t\t\t"
		prefix = prefixes[breedcount]
		#create breed selector:
		if (rgx != "[a-z]$"): #not a modern breed
			breedlist.append(spacer+"<option value='none'>"+btypes[breedcount]+"</option>")
			breedcount += 1
		else:
			breedcount += 1
			breedlist.append(spacer+"<option value='none'>Select Breed</option>")
			for row in mbreeds.itertuples(index=True):
				breedlist.append(spacer+"<option value='{}_{}'>".format(int(row[2]), int(row[3])) + row[1] + "</option>")
				
		#primary selector
		for row in primary.itertuples():
			#print(row)
			if(re.search(rgx, row[1]) is not None or row[1] == "Basic"):
				if (rgx == "[a-z]$"):
					elname = row[1]
				else:
					elname = re.sub(" \([A-Za-z]+\)", "", row[1])
				#if (rgx == "Au[)]$|Basic"):
					#print(elname)
				prilist.append(spacer+"<option value='{}_{}'>".format(int(row[2]), int(row[3])) + elname + "</option>")

		#secondary selector
		for row in secondary.itertuples():
			if(re.search(rgx, row[1]) is not None or row[1] == "Basic"):
				if (rgx == "[a-z]$"):
					elname = row[1]
				else:
					elname = re.sub(" \([A-Za-z]+\)", "", row[1])
				seclist.append(spacer+"<option value='{}_{}'>".format(int(row[2]), int(row[3])) + elname + "</option>")
		
		#tertiary selector
		for row in tertiary.itertuples():
			if(re.search(rgx, row[1]) is not None or row[1] == "Basic"):
				if (rgx == "[a-z]$"):
					elname = row[1]
				else:
					elname = re.sub(" \([A-Za-z]+\)", "", row[1])
				tertlist.append(spacer+"<option value='{}_{}'>".format(int(row[2]), int(row[3])) + elname + "</option>")

		#start filling template
		if (rgx == "[a-z]$"):
			disable = ""
		else:
			disable = " disabled"
		with open("./tab-blank.txt", "r") as ftab:
			write = True
			for line in ftab:
				if (re.search("PREFIX", line) is not None):
					line = re.sub("PREFIX", prefix, line)
				if (re.search("BREEDDISABLE", line) is not None):
					line = re.sub(" BREEDDISABLE", disable, line)
				if (re.search("BREED", line) is not None):
					write = False
					for el in breedlist:
						fout.write(el+"\n")
				elif (re.search("PRIMARY", line) is not None):
					write = False
					for el in prilist:
						fout.write(el+"\n")
				elif (re.search("SECONDARY", line) is not None):
					write = False
					for el in seclist:
						fout.write(el+"\n")
				elif (re.search("TERTIARY", line) is not None):
					write = False
					for el in tertlist:
						fout.write(el+"\n")
				if (write):
					fout.write(line)
				else:
					write = True
		#-> fill template
		#platzhlter -> breedtype (tab name), prefix, breed, breeddisable, primary, secondary, tertiary
		#modern breed: "none" entry (select)
	#end of document
	fout.write("\n</div>\n</body>")
