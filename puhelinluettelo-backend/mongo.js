const mongoose = require('mongoose')
const password = process.argv[2]

const url =`mongodb+srv://seimuli:${password}@cluster0.mrjew.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)


if (process.argv.length === 3 )  {

  Person.find({}).then(result => {
    console.log('phonebook:');
      result.forEach(person => {
        console.log(person.name+' '+person.number)
            mongoose.connection.close()
      })
  })
}

if (process.argv.length === 5 ) {

    const contact = new Person({
      name: process.argv[3],
      number: process.argv[4],
    })

    contact.save().then(result => {
        console.log('added '+result.name+' number '+ result.number+' to phonebook')
        mongoose.connection.close()
    })  
    
}