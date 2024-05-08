const express = require("express")
const {Pool} = require("pg")
const cors =  require("cors")
require('dotenv').config();

const app = express();
app.use(cors())

const PORT = 4000;

//PostgreSQL configuration
const pool = new Pool({
    user: process.env.DB_USER, //username of db
    host: process.env.DB_HOST, //host address host.docker.internal
    database: process.env.DB_DATABASE, //database name
    password: process.env.DB_PASSWORD, //user password
    port: process.env.DB_PORT //port number for postgresql
  });

  app.listen(PORT,() => {
    console.log(`server running on port ${PORT}`);
  });

  //creating api endponit
app.get("/data", async (req,res) => {
    try {
    const numberOfDays = req.query.days; // Default to 12 days if no parameter is provided
     
      const client = await pool.connect(); //connect to database
      const result = await client.query(`select met.testpass_name,ted.app,ted.pod,ted.jar,jjs.job_id,ted.class_name, jjs.job_status, jjs.creation_datetime,TO_CHAR(jjs.update_datetime-jjs.creation_datetime,'HH24:MI:SS') as duration
      from jenkins_job_status jjs
      join test_execution_details ted
      on jjs.test_exec_id=ted.test_exec_id
      join master_test_execution met
      on met.execution_id=ted.execution_id
      where jjs.creation_datetime >= current_date - interval '${numberOfDays} days'
      order by ted.class_name,duration`); //making query to get data
      client.release(); //connecion stopped.
      res.json(result.rows); //returning data

      console.log(result.rowCount);

    } catch (err) {
      console.error("Error executing query", err);//printing error
      res.status(500).json({ error: "Internal Server Error" });//returning error status
      console.log("in error");
    }
  });
  

app.put("/updateIsCompleted", async (req, res) => {
  try {
    const testRunId = req.query.testrun_id;

    if (!testRunId) {
      return res.status(400).json({ error: "Missing testrun_id parameter" });
    }
    const client = await pool.connect();
  
    const result = await client.query(
      `UPDATE test_execution_details
       SET is_completed = true
       WHERE testrun_id = $1`,
      [testRunId]
    );

    client.release();
    const rowCount = result.rowCount; // Get the number of rows affected
    
   if(rowCount>0){
    res.json({ message: ` Hey! ${rowCount} Record(s) updated. IsCompleted set to True for TestRunId: ${testRunId}` });
   } 
   else {
     res.json({message:`Sorry! It is Invalid (or) Unknown TestRunId: ${testRunId}`})
   }
 
  } 
  catch (err) {
    console.error( "Error Updating is_completed Records", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

