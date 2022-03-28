

exports.getAllClassrooms = (async (req, res, next) => {
  const connection = db.getConnection();

  let cursor;
  cursor = await connection.collection('classrooms').find();
  
  var classrooms = [];
  
  cursor.each(function(err, doc) {
    assert.equal(err, null);
    if (doc != null) {
      console.log(doc)
      classrooms.push(doc)
    } else {
        // callback();
        // TODO: ERROR
    }
  });
 
 
  res.status(200)
    .json({
        status: 'success',
        classrooms
    });

    
});
 

exports.insertClassroom