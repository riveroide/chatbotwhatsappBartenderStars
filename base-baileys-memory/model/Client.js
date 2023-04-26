const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const clientSchema = new Schema(
  {
    telefone: { type: String, required: true },
    nome: { type: String, required: true },
    data: { type: String , default: 'DD/MM/AAAA'},
    pessoas: { type: String, default: '0' },
    horas: { type: String, default:'0'},
    cardapio: { type: String, default:'empty'},
    status: { type: String, default: "pending" },
  },
  {
    timestamps: true,
  }
);

clientSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id;
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = model("Client", clientSchema);