import path from "path";
import fs from "fs";
import csv from "csv-parser";
import pool from "./dataBase_conection.js";

export const uploadClientesCSV = () => {
  return new Promise((resolve, reject) => {
    const inserts = [];
    const filePath = path.join(process.cwd(), "uploads", "clientes.csv"); // ruta absoluta

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const insertPromise = pool.query(
          "INSERT INTO clientes (cliente_id, nombre, cedula, direccion, telefono, correo, plataforma) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [row.cliente_id, row.nombre, row.cedula, row.direccion, row.telefono, row.correo, row.plataforma ]
        );
        inserts.push(insertPromise);
      })
      .on("end", async () => {
        try {
          await Promise.all(inserts);
          console.log(`Insertadas ${inserts.length} filas correctamente.`);
          resolve({ rowsInserted: inserts.length });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
};

export const uploadFacturacionesCSV = () => {
  return new Promise((resolve, reject) => {
    const inserts = [];
    const filePath = path.join(process.cwd(), "uploads", "facturaciones.csv"); // ruta absoluta

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const insertPromise = pool.query(
          "INSERT INTO facturaciones (factura_id, periodo, mont_facturado, mont_pagado) VALUES ($1, $2, $3, $4)",
          [row.factura_id, row.periodo, row.mont_facturado, row.mont_facturado]
        );
        inserts.push(insertPromise);
      })
      .on("end", async () => {
        try {
          await Promise.all(inserts);
          console.log(`Insertadas ${inserts.length} filas correctamente.`);
          resolve({ rowsInserted: inserts.length });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
}

export const uploadTransaccionesCSV = () => {
  return new Promise((resolve, reject) => {
    const inserts = [];
    const filePath = path.join(process.cwd(), "uploads", "transacciones.csv"); // ruta absoluta

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const insertPromise = pool.query(
          "INSERT INTO transacciones (transaccion_id, fecha, monto_transaccion, estado, tipo, cliente_id, factura_id) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [row.transaccion_id, row.fecha, row.monto_transaccion, row.estado, row.tipo, row.cliente_id, row.factura_id]
        );
        inserts.push(insertPromise);
      })
      .on("end", async () => {
        try {
          await Promise.all(inserts);
          console.log(`Insertadas ${inserts.length} filas correctamente.`);
          resolve({ rowsInserted: inserts.length });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
}

//export const uploadFacturacionesCSV = () => {
 /* return new Promise((resolve, reject) => {
    const inserts = [];
    const filePath = path.join(process.cwd(), "uploads", "facturaciones.csv"); // ruta absoluta

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        const insertPromise = pool.query(
          "INSERT INTO facturaciones (factura_id, cita_id, metodo_pago) VALUES ($1, $2, $3)",
          [row.factura_id, row.cita_id, row.metodo_pago]
        );
        inserts.push(insertPromise);
      })
      .on("end", async () => {
        try {
          await Promise.all(inserts);
          console.log(`Insertadas ${inserts.length} filas correctamente.`);
          resolve({ rowsInserted: inserts.length });
        } catch (err) {
          reject(err);
        }
      })
      .on("error", (err) => reject(err));
  });
}*/