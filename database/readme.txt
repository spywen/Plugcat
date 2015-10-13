mongoimport -d plugcat -c colors --type csv --file colors.csv --headerline

13/10/2015 Define default color :
db.colors.update({name:"Teal"},{$set:{default:true}})