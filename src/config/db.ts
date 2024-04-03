import mongoose from "mongoose";
const DATABASE_NAME = "db_middle_class";
const CONNECTION_STRING = `mongodb+srv://duraibytes:d52nnvOMMqtiPtlK@cluster0.rntgzuk.mongodb.net/${DATABASE_NAME}`;

const connectDb = async () => {
  try {
    const connect = await mongoose.connect(CONNECTION_STRING);
    console.log(
      "Database connected: ",
      connect.connection.host,
      connect.connection.name
    );
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

export default connectDb;