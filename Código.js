Codigo.gs
// --- CONSTANTES GLOBALES ---
const SPREADSHEET_ID = '1Ru-XGng2hYJbUvl-H2IA7aYQx7Ju-jk1LT1fkYOnG0w';
/* */
const NOMBRE_HOJA_BUSQUEDA = 'Base de Datos';
const NOMBRE_HOJA_REGISTRO = 'Registros';
const NOMBRE_HOJA_CONFIG = 'Config';
/* */
const FOLDER_ID_FOTOS = '1S2SbkuYdvcLFZYoHacfgwEU80kAN094l';
const FOLDER_ID_FICHAS = '1aDsTTDWHiDFUeZ8ByGp8_LY3fdzVQomu';
const FOLDER_ID_COMPROBANTES = '169EISq4RsDetQ0H3B17ViZFfe25xPcMM'; // (Q4) Carpeta de mi respuesta anterior

// --- (¡¡¡CONSTANTES "Base de Datos" ACTUALIZADAS!!!) ---
// (Se elimina Col C "Nombre y Apellido", se agrega C "Precios", F "Nombre", G "Apellido")
const COL_HABILITADO_BUSQUEDA = 2; // Col B ("Habilitación")
const COL_PRECIOS_BUSQUEDA = 3; // 🛑 NUEVA Col C ("Precios")
const COL_FECHA_NACIMIENTO_BUSQUEDA = 4; // Col D (Sin cambios)
// Col E (Descripción) se salta
const COL_NOMBRE_BUSQUEDA = 6; // 🛑 NUEVA Col F ("Nombre")
const COL_APELLIDO_BUSQUEDA = 7; // 🛑 NUEVA Col G ("Apellido")
const COL_DNI_BUSQUEDA = 8; // Col H (antes F)
const COL_OBRASOCIAL_BUSQUEDA = 9; // Col I (antes G)
const COL_COLEGIO_BUSQUEDA = 10; // Col J (antes H)
const COL_RESPONSABLE_BUSQUEDA = 11; // Col K (antes I)
const COL_TELEFONO_BUSQUEDA = 12; // Col L (antes J)

// =========================================================
// (¡¡¡CONSTANTES "Registros" ACTUALIZADAS!!!) - 39 columnas total
// (Se divide F, se agrega N, O, Q. Se elimina N anterior)
// =========================================================
const COL_NUMERO_TURNO = 1; // A
const COL_MARCA_TEMPORAL = 2; // B
const COL_MARCA_N_E_A = 3; // C
const COL_ESTADO_NUEVO_ANT = 4; // D
const COL_EMAIL = 5; // E
const COL_NOMBRE = 6; // F (Antes Apellido y Nombre)
const COL_APELLIDO = 7; // G 🛑 NUEVA
const COL_FECHA_NACIMIENTO_REGISTRO = 8; // H (antes G)
const COL_EDAD_ACTUAL = 9; // I (antes H)
const COL_DNI_INSCRIPTO = 10; // J (antes I)
const COL_OBRA_SOCIAL = 11; // K (antes J)
const COL_COLEGIO_JARDIN = 12; // L (antes K)
const COL_ADULTO_RESPONSABLE_1 = 13; // M (antes L)
const COL_DNI_RESPONSABLE_1 = 14; // N 🛑 NUEVA
const COL_TELEFONO_RESPONSABLE_1 = 15; // O 🛑 NUEVA
const COL_ADULTO_RESPONSABLE_2 = 16; // P (antes M)
const COL_TELEFONO_RESPONSABLE_2 = 17; // Q 🛑 NUEVA
const COL_PERSONAS_AUTORIZADAS = 18; // R (antes O)
const COL_PRACTICA_DEPORTE = 19; // S (antes P)
const COL_ESPECIFIQUE_DEPORTE = 20; // T (antes Q)
const COL_TIENE_ENFERMEDAD = 21; // U (antes R)
const COL_ESPECIFIQUE_ENFERMEDAD = 22; // V (antes S)
const COL_ES_ALERGICO = 23; // W (antes T)
const COL_ESPECIFIQUE_ALERGIA = 24; // X (antes U)
const COL_APTITUD_FISICA = 25; // Y (antes V)
const COL_FOTO_CARNET = 26; // Z (antes W)
const COL_JORNADA = 27; // AA (antes X)
const COL_METODO_PAGO = 28; // AB (antes Y)
// --- Cuotas ---
const COL_CUOTA_1 = 29; // AC (antes Z)
const COL_CUOTA_2 = 30; // AD (antes AA)
const COL_CUOTA_3 = 31; // AE (antes AB)
const COL_CANTIDAD_CUOTAS = 32; // AF (antes AC)
// --- Pagos ---
const COL_ESTADO_PAGO = 33; // AG (antes AD)
const COL_ID_PAGO_MP = 34; // AH (antes AE)
const COL_PAGADOR_NOMBRE = 35; // AI (antes AF)
const COL_PAGADOR_DNI = 36; // AJ (antes AG)
const COL_COMPROBANTE_MP = 37; // AK (antes AH)
const COL_COMPROBANTE_MANUAL = 38; // AL (antes AI)
const COL_ENVIAR_EMAIL_MANUAL = 39; // AM (antes AJ)
// =========================================================

// =========================================================
// (¡¡¡FUNCIÓN doGet CORREGIDA!!!)
// (M) Esta corrección evita la pantalla en blanco al requerir un click del usuario.
// =========================================================
function doGet(e) {
try {
const params = e.parameter;
Logger.log("doGet INICIADO. Parámetros de URL: " + JSON.stringify(params));
let paymentId = null;

if (params) {
if (params.payment_id) {
paymentId = params.payment_id;
} else if (params.data && typeof params.data === 'string' && params.data.startsWith('{')) {
try {
const dataObj = JSON.parse(params.data);
if (dataObj.id) paymentId = dataObj.id;
} catch (jsonErr) {
Logger.log("No se pudo parsear e.parameter.data: " + params.data);
}
} else if (params.topic && params.topic === 'payment' && params.id) {
paymentId = params.id;
}
}

const appUrl = ScriptApp.getService().getUrl();

// --- (¡¡¡NUEVA LÓGICA DE REDIRECCIÓN!!!) ---
if (paymentId) {
// 1. SI HAY UN ID DE PAGO, PROCESARLO
Logger.log("doGet detectó regreso de MP. Procesando Payment ID: " + paymentId);
procesarNotificacionDePago(paymentId); // Vive en Pagos.gs

// 2. MOSTRAR PÁGINA DE ÉXITO CON BOTÓN (Redirección manual)
Logger.log("Mostrando página de éxito para redirección MANUAL: " + appUrl);
const html = `
<html>
<head>
<title>Pago Completo</title>
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body { font-family: Arial, sans-serif; display: flex; justify-content: center; align-items: center; height: 90vh; flex-direction: column; text-align: center; background-color: #f4f4f4; }
.container { background-color: #fff; padding: 30px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
.btn { display: inline-block; padding: 15px 30px; background-color: #28a745; color: white; text-decoration: none; border-radius: 5px; font-size: 1.2em; margin-top: 20px;
transition: background-color 0.3s; }
.btn:hover { background-color: #218838; }
h2 { color: #28a745; }
p { font-size: 1.1em; color: #333; }
</style>
</head>
<body>
<div class="container">
<h2>¡Pago Procesado Exitosamente!</h2>
<p>Gracias por completar el pago. Presione el botón para volver al formulario.</p>
<a href="${appUrl}" target="_top" class="btn">Volver al Formulario</a>
</div>
</body>
</html>`;

return HtmlService.createHtmlOutput(html)
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT);

} else {
// 3. SI NO HAY ID DE PAGO, SERVIR EL FORMULARIO
const htmlTemplate = HtmlService.createTemplateFromFile('Index');
htmlTemplate.appUrl = appUrl;
const html = htmlTemplate.evaluate()
.setTitle("Formulario de Registro")
.setXFrameOptionsMode(HtmlService.XFrameOptionsMode.DEFAULT)
.addMetaTag('viewport', 'width=device-width, initial-scale=1');
return html;
}
// --- (FIN DE LA NUEVA LÓGICA) ---

} catch (err) {
Logger.log("Error en la detección de parámetros de doGet: " + err.toString());
// Fallback por si todo falla
return HtmlService.createHtmlOutput("<b>Ocurrió un error:</b> " + err.message);
}
}
// =========================================================
// (FIN DE LA CORRECCIÓN de doGet)
// =========================================================

/* */
function doPost(e) {
let postData;
try {
Logger.log("doPost INICIADO. Contenido de 'e': " + JSON.stringify(e));
if (!e || !e.postData || !e.postData.contents) {
Logger.log("Error: El objeto 'e' o 'e.postData.contents' está vacío.");
return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": "Payload vacío" })).setMimeType(ContentService.MimeType.JSON);
}
postData = e.postData.contents;
Logger.log("doPost: Datos recibidos (raw): " + postData);
const notificacion = JSON.parse(postData);
Logger.log("doPost: Datos parseados (JSON): " + JSON.stringify(notificacion));

if (notificacion.type === 'payment') {
const paymentId = notificacion.data.id;
if (paymentId) {
Logger.log("Procesando ID de pago (desde doPost): " + paymentId);
procesarNotificacionDePago(paymentId); // Vive en Pagos.gs
}
}
return ContentService.createTextOutput(JSON.stringify({ "status": "ok" })).setMimeType(ContentService.MimeType.JSON);
} catch (error) {
Logger.log("Error grave en doPost (Webhook): " + error.toString());
Logger.log("Datos (raw) que causaron el error: " + postData);
return ContentService.createTextOutput(JSON.stringify({ "status": "error", "message": error.toString() })).setMimeType(ContentService.MimeType.JSON);
}
}

/**
* (M) Guarda los datos finales en la hoja "Registros" (39 COLUMNAS)
* 🛑 NUEVO: Acepta un flag "isSibling" para saltar el check de Foto Carnet.
*/
/* */
function registrarDatos(datos, isSibling = false) {
const lock = LockService.getScriptLock();
try {
lock.waitLock(60000);

// 🛑 NUEVO: Check de Foto Carnet movido aquí.
// Solo se requiere para el inscripto principal, no para hermanos (se pedirá al pagar).
if (!isSibling && !datos.urlFotoCarnet) {
Logger.log("Error: El formulario (principal) se envió sin la URL de la Foto Carnet.");
return { status: 'ERROR', message: 'Falta la Foto Carnet. Por favor, asegúrese de que el archivo se haya subido correctamente.' };
}

const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
let estadoActual = obtenerEstadoRegistro();

if (estadoActual.cierreManual) return { status: 'CERRADO', message: 'El registro se encuentra cerrado.' };
if (estadoActual.alcanzado) return { status: 'LIMITE_ALCANZADO', message: 'Se ha alcanzado el cupo máximo.' };
if (datos.jornada === 'Jornada Normal extendida' && estadoActual.jornadaExtendidaAlcanzada) {
return { status: 'LIMITE_EXTENDIDA', message: 'Se agotó el cupo para Jornada Extendida.' };
}

const dniBuscado = limpiarDNI(datos.dni);

let hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (!hojaRegistro) {
hojaRegistro = ss.insertSheet(NOMBRE_HOJA_REGISTRO);

// --- (¡¡¡ENCABEZADOS ACTUALIZADOS!!!) ---
hojaRegistro.appendRow([
'N° de Turno', 'Marca temporal', 'Marca N/E',
'Estado', // (D)
'Email', 'Nombre', 'Apellido', // F, G 🛑
'Fecha de Nacimiento', 'Edad Actual', // H, I
'DNI', 'Obra Social', 'Colegio/Jardin', // J, K, L
'Responsable 1', 'DNI Resp 1', 'Teléfono Resp 1', // M, N, O 🛑
'Responsable 2', 'Teléfono Resp 2', // P, Q 🛑
'Autorizados', // R
'Deporte', 'Especifique Deporte', 'Enfermedad', 'Especifique Enfermedad', 'Alergia', 'Especifique Alergia', // S-X
'Aptitud Física (Link)', // Y
'Foto Carnet (Link)', // Z
'Jornada', // AA
'Método de Pago', // AB
'Cuota 1', 'Cuota 2', 'Cuota 3', // AC, AD, AE
'Cantidad Cuotas', // (AF)
'Estado de Pago', // (AG)
'ID Pago MP', 'Nombre Pagador', 'DNI Pagador',
'Comprobante MP',
'Comprobante Manual',
'Enviar Email?' // (AM)
]);
}

// (c) Corrección N° Turno
const nuevoNumeroDeTurno = hojaRegistro.getLastRow();

const edadCalculada = calcularEdad(datos.fechaNacimiento);
const edadFormateada = (edadCalculada && edadCalculada.anos >= 0) ? `${edadCalculada.anos}a, ${edadCalculada.meses}m, ${edadCalculada.dias}d` : '';
const fechaObj = new Date(datos.fechaNacimiento);
const fechaFormateada = (datos.fechaNacimiento) ? Utilities.formatDate(fechaObj, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd') : '';
const marcaNE = (datos.jornada === 'Jornada Normal extendida' ? 'E' : 'N');

// (e) Nueva columna Estado
const estadoInscripto = (datos.tipoInscripto === 'nuevo') ? 'Nuevo' : 'Anterior';

// --- (¡¡¡FILA ACTUALIZADA!!!) ---
hojaRegistro.appendRow([
nuevoNumeroDeTurno,
new Date(), marcaNE,
estadoInscripto, // (D)
datos.email || '', datos.nombre || '', datos.apellido || '', // E, F, G 🛑
fechaFormateada, edadFormateada, // H, I
dniBuscado, datos.obraSocial || '', datos.colegioJardin || '', // J, K, L
datos.adultoResponsable1 || '', // M
datos.dniResponsable1 || '', // N 🛑
datos.telefonoResponsable1 || '', // O 🛑
datos.adultoResponsable2 || '', // P
datos.telefonoResponsable2 || '', // Q 🛑
datos.personasAutorizadas || '', // R
datos.practicaDeporte || '', datos.especifiqueDeporte || '', // S, T
datos.tieneEnfermedad || '', datos.especifiqueEnfermedad || '', // U, V
datos.esAlergico || '', datos.especifiqueAlergia || '', // W, X
datos.urlCertificadoAptitud || '', // Y
datos.urlFotoCarnet || '', // Z
datos.jornada || '', // AA
datos.metodoPago || '', // AB
'', '', '', // Cuota 1, 2, 3 (AC, AD, AE)
parseInt(datos.cantidadCuotas) || 0, // Cantidad de Cuotas (AF)
datos.estadoPago || '', // Estado de Pago (AG)
'', '', '', '', '', // IDs de Pago (AH-AL)
false // Checkbox (AM)
]);

const rule = SpreadsheetApp.newDataValidation().requireCheckbox().build();
hojaRegistro.getRange(nuevoNumeroDeTurno + 1, COL_ENVIAR_EMAIL_MANUAL).setDataValidation(rule);

SpreadsheetApp.flush();

obtenerEstadoRegistro(); // Actualiza el contador de cupos

return { status: 'OK_REGISTRO', message: '¡Registro Exitoso!', numeroDeTurno: nuevoNumeroDeTurno, datos: datos };

} catch (e) {
Logger.log("ERROR CRÍTICO EN REGISTRO: " + e.toString());
return { status: 'ERROR', message: 'Fallo al registrar los datos: ' + e.message };
} finally {
lock.releaseLock();
}
}

// --- FUNCIONES DE AYUDA (Helpers) ---

/* */
function uploadFileToDrive(data, mimeType, filename, dni, tipoArchivo) {
try {
if (!dni) return { status: 'ERROR', message: 'No se recibió DNI.' };
let parentFolderId;
switch (tipoArchivo) {
case 'foto': parentFolderId = FOLDER_ID_FOTOS; break;
case 'ficha': parentFolderId = FOLDER_ID_FICHAS; break; // 'ficha' es para Aptitud Física
case 'comprobante': parentFolderId = FOLDER_ID_COMPROBANTES; break;
default: return { status: 'ERROR', message: 'Tipo de archivo no reconocido.' };
}
if (!parentFolderId || parentFolderId.includes('AQUI_VA_EL_ID')) {
return { status: 'ERROR', message: 'IDs de carpetas no configurados.' };
}

const parentFolder = DriveApp.getFolderById(parentFolderId);
let subFolder;
const folders = parentFolder.getFoldersByName(dni);
subFolder = folders.hasNext() ? folders.next() : parentFolder.createFolder(dni);

const decodedData = Utilities.base64Decode(data.split(',')[1]);
const blob = Utilities.newBlob(decodedData, mimeType, filename);
const file = subFolder.createFile(blob);
file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
return file.getUrl();

} catch (e) {
Logger.log('Error en uploadFileToDrive: ' + e.toString());
return { status: 'ERROR', message: 'Error al subir archivo: ' + e.message };
}
}

/* */
function limpiarDNI(dni) {
if (!dni) return '';
return String(dni).replace(/[.\s-]/g, '').trim();
}

/* */
function calcularEdad(fechaNacimientoStr) {
if (!fechaNacimientoStr) return { anos: -1, meses: 0, dias: 0 }; // Devuelve -1 en error
const fechaNacimiento = new Date(fechaNacimientoStr);
if (isNaN(fechaNacimiento.getTime())) return { anos: -1, meses: 0, dias: 0 };

const hoy = new Date();
fechaNacimiento.setMinutes(fechaNacimiento.getMinutes() + fechaNacimiento.getTimezoneOffset());
let anos = hoy.getFullYear() - fechaNacimiento.getFullYear();
let meses = hoy.getMonth() - fechaNacimiento.getMonth();
let dias = hoy.getDate() - fechaNacimiento.getDate();
if (dias < 0) {
meses--;
dias += new Date(hoy.getFullYear(), hoy.getMonth(), 0).getDate();
}
if (meses < 0) {
anos--;
meses += 12;
}
return { anos, meses, dias };
}

/**
* Verifica el estado de los cupos y el cierre manual.
* (Q8, Q11) Esta función es la clave para la seguridad de cupos.
*/
function obtenerEstadoRegistro() {
try {
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);
const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (!hojaConfig) throw new Error(`Hoja "${NOMBRE_HOJA_CONFIG}" no encontrada.`);

const limiteCupos = parseInt(hojaConfig.getRange('B1').getValue()) || 100;
// 🛑 CORRECCIÓN: Leer el límite de B4 (LIMITE GUARDA)
const limiteJornadaExtendida = parseInt(hojaConfig.getRange('B4').getValue());
const formularioAbierto = hojaConfig.getRange('B11').getValue() === true;

let registrosActuales = 0;
let registrosJornadaExtendida = 0;
if (hojaRegistro && hojaRegistro.getLastRow() > 1) {
registrosActuales = hojaRegistro.getLastRow() - 1;
const data = hojaRegistro.getRange(2, COL_MARCA_N_E_A, registrosActuales, 1).getValues();
registrosJornadaExtendida = data.filter(row => row[0] === 'E').length;
}

hojaConfig.getRange('B2').setValue(registrosActuales);
// 🛑 CORRECCIÓN: Escribir el contador en B5 (CONTADOR)
hojaConfig.getRange('B5').setValue(registrosJornadaExtendida);
SpreadsheetApp.flush();

return {
alcanzado: registrosActuales >= limiteCupos,
// 🛑 CORRECCIÓN: Compara el contador con el límite (B4)
jornadaExtendidaAlcanzada: registrosJornadaExtendida >= limiteJornadaExtendida,
cierreManual: !formularioAbierto
};
} catch (e) {
Logger.log("Error en obtenerEstadoRegistro: " + e.message);
return { cierreManual: true, message: "Error al leer config: " + e.message };
}
}

/**
* (¡¡¡FUNCIÓN validarAcceso ACTUALIZADA!!!)
* - Actualizadas constantes de "Registros" (DNI, Nombres, etc.)
* - Actualizadas constantes de "Base de Datos" (DNI, Nombres, etc.)
* - 🛑 NUEVO: Bloqueo de pago para hermanos pre-registrados incompletos.
*/
function validarAcceso(dni, tipoInscripto) {
try {
const estado = obtenerEstadoRegistro();
if (estado.cierreManual) return { status: 'CERRADO', message: 'El formulario se encuentra cerrado por mantenimiento.' };
if (estado.alcanzado && tipoInscripto === 'nuevo') return { status: 'LIMITE_ALCANZADO', message: 'Se ha alcanzado el cupo máximo para nuevos registros.'
};

if (!dni) return { status: 'ERROR', message: 'El DNI no puede estar vacío.' };
const dniLimpio = limpiarDNI(dni);
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);

// 1. BUSCAR EN LA HOJA DE REGISTROS ACTUALES ("Registros") PRIMERO
const hojaRegistro = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (hojaRegistro && hojaRegistro.getLastRow() > 1) {
// 🛑 Constante actualizada
const rangoDniRegistro = hojaRegistro.getRange(2, COL_DNI_INSCRIPTO, hojaRegistro.getLastRow() - 1, 1);
const celdaRegistro = rangoDniRegistro.createTextFinder(dniLimpio).matchEntireCell(true).findNext();

if (celdaRegistro) {
// ¡ENCONTRADO! El DNI ya está en la planilla de este año. BLOQUEA EL REGISTRO
const filaRegistro = celdaRegistro.getRow();
const rangoFila = hojaRegistro.getRange(filaRegistro, 1, 1, hojaRegistro.getLastColumn()).getValues()[0];

// 🛑 Constantes actualizadas
const estadoPago = rangoFila[COL_ESTADO_PAGO - 1];
const metodoPago = rangoFila[COL_METODO_PAGO - 1];
const nombreRegistrado = (rangoFila[COL_NOMBRE - 1] || '') + ' ' + (rangoFila[COL_APELLIDO - 1] || '');

if (estadoPago === 'Pagado') {
// (a) CHEQUEO DE APTITUD FÍSICA
// 🛑 Constante actualizada
const aptitudFisica = rangoFila[COL_APTITUD_FISICA - 1];
const adeudaAptitud = !aptitudFisica;

return {
status: 'DUPLICADO_PAGADO',
message: `✅ El DNI ${dniLimpio} (${nombreRegistrado.trim()}) ya se encuentra REGISTRADO y la inscripción está PAGADA.`,
adeudaAptitud: adeudaAptitud
};
}

if (String(metodoPago).includes('Efectivo')) {
return {
status: 'DUPLICADO_PENDIENTE_EFECTIVO',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado.trim()}) ya se encuentra REGISTRADO. El pago en efectivo está PENDIENTE.
Por favor, acérquese a la administración.`
};
}

// 🛑 --- INICIO DE VALIDACIÓN DE HERMANO INCOMPLETO --- 🛑
const obraSocialReg = rangoFila[COL_OBRA_SOCIAL - 1];
const deporteReg = rangoFila[COL_PRACTICA_DEPORTE - 1];
const fotoReg = rangoFila[COL_FOTO_CARNET - 1];

if (!obraSocialReg || !deporteReg || !fotoReg || obraSocialReg === '' || deporteReg === '' || fotoReg === '') {
// Si falta alguno de estos datos clave, es un hermano pre-registrado.
return {
status: 'INCOMPLETE_REGISTRATION',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado.trim()}) está pre-registrado (como hermano).
Para poder pagar, debe completar el registro (Datos de Salud, Foto Carnet, etc.).
Por favor, contacte a la administración.`
};
}
// 🛑 --- FIN DE VALIDACIÓN DE HERMANO INCOMPLETO --- 🛑

try {
const datosParaPago = {
dni: dniLimpio,
nombre: rangoFila[COL_NOMBRE - 1], // 🛑
apellido: rangoFila[COL_APELLIDO - 1], // 🛑
email: rangoFila[COL_EMAIL - 1],
metodoPago: metodoPago,
jornada: rangoFila[COL_JORNADA - 1]
};

let identificadorPago = null; // null para Pago Total, "C1" etc para cuotas

if (metodoPago === 'Pago en Cuotas') {
const cantidadCuotasRegistrada = parseInt(rangoFila[COL_CANTIDAD_CUOTAS - 1]) || 3;

for (let i = 1; i <= cantidadCuotasRegistrada; i++) {
// 🛑 Constantes actualizadas
let colCuota = i === 1 ? COL_CUOTA_1 : (i === 2 ? COL_CUOTA_2 : COL_CUOTA_3);
let cuota_status = rangoFila[colCuota - 1];

if (!cuota_status || (!cuota_status.toString().includes("Pagada") && !cuota_status.toString().includes("Notificada"))) {
identificadorPago = `C${i}`; // "C1", "C2" o "C3"
break;
}
}

if (identificadorPago == null) {
// No hay cuotas pendientes
const aptitudFisica = rangoFila[COL_APTITUD_FISICA - 1]; // 🛑
const adeudaAptitud = !aptitudFisica;
return {
status: 'DUPLICADO_PAGADO',
message: `✅ El DNI ${dniLimpio} (${nombreRegistrado.trim()}) ya completó todas las cuotas.`,
adeudaAptitud: adeudaAptitud
};
}
}

// Llamar a crearPreferenciaDePago (que ahora devuelve un string de link o string de error)
const init_point = crearPreferenciaDePago(datosParaPago, identificadorPago, rangoFila[COL_CANTIDAD_CUOTAS - 1]); // Vive en Pagos.gs

// Verificar si la creación del link falló (p.ej. bloqueo de repago)
if (!init_point || !init_point.toString().startsWith('http')) {
Logger.log(`Bloqueo de repago detectado por validarAcceso: ${init_point}`);
return {
status: 'DUPLICADO_PENDIENTE_ERROR',
message: `⚠️ Error al generar link: ${init_point}`
};
}

// Si es un link http válido, continuar
return {
status: 'DUPLICADO_PENDIENTE_PAGO',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado.trim()}) ya se encuentra REGISTRADO.
Se generó un link para la próxima cuota pendiente (${identificadorPago || 'Pago Total'}).`,
init_point: init_point // Devolver solo el link
};

} catch (e) {
Logger.log("Error al regenerar link de pago en validarAcceso: " + e.message);
return {
status: 'DUPLICADO_PENDIENTE_ERROR',
message: `⚠️ El DNI ${dniLimpio} (${nombreRegistrado.trim()}) ya se encuentra REGISTRADO.
El pago está PENDIENTE, pero hubo un error al generar el link de pago: ${e.message}`
};
}
}
}
// --- FIN DE LA BÚSQUEDA EN "Registros" ---

// 2. (b) VALIDACIÓN ESTRICTA: CRUZAR "tipoInscripto" CON "Base de Datos"
const hojaBusqueda = ss.getSheetByName(NOMBRE_HOJA_BUSQUEDA);
if (!hojaBusqueda) return { status: 'ERROR', message: `La hoja "${NOMBRE_HOJA_BUSQUEDA}" no fue encontrada.` };

// 🛑 Constante actualizada
const rangoDNI = hojaBusqueda.getRange(2, COL_DNI_BUSQUEDA, hojaBusqueda.getLastRow() - 1, 1);
const celdaEncontrada = rangoDNI.createTextFinder(dniLimpio).matchEntireCell(true).findNext();

if (celdaEncontrada) {
// DNI SÍ EXISTE en Base de Datos
if (tipoInscripto === 'nuevo') {
// ERROR: Es "anterior" pero seleccionó "nuevo"
return { status: 'ERROR_TIPO_NUEVO', message: "El DNI se encuentra en la base datos, cambie 'SOY INSCRIPTO ANTERIOR' y valide nuevamente" };
}

// Es "anterior" y seleccionó "anterior" -> OK
const rowIndex = celdaEncontrada.getRow();

// 🛑 --- INICIO DE LA NUEVA VALIDACIÓN (Habilitación) --- 🛑
// 1. Leemos la fila COMPLETA (o al menos desde la Col B)
// El rango (Col B=2 a Col L=12) necesita 11 columnas.
const fila = hojaBusqueda.getRange(rowIndex, COL_HABILITADO_BUSQUEDA, 1, 11).getValues()[0];

// 2. Verificamos la Col B (índice 0 del array 'fila')
const habilitado = fila[0]; // fila[0] es la COL_HABILITADO_BUSQUEDA

if (habilitado !== true) {
// Si la casilla no está tildada (es FALSE o está vacía)
return {
status: 'NO_HABILITADO',
message: 'El dni se encuentra en la base de datos, pero no esta habilitado para la inscripción, consulte con la organización:'
};
}
// 🛑 --- FIN DE LA NUEVA VALIDACIÓN --- 🛑

// 3. Si está habilitado, extraemos los datos (con los nuevos índices)
// fila[0] = Habilitado (B)
// fila[1] = Precios (C)
const fechaNacimientoRaw = fila[2]; // Col D (índice 2)
// fila[3] = (E)
const nombre = String(fila[4] || '').trim(); // Col F (índice 4) 🛑
const apellido = String(fila[5] || '').trim(); // Col G (índice 5) 🛑
// fila[6] = DNI (H)
const obraSocial = String(fila[7] || '').trim(); // Col I (índice 7) 🛑
const colegioJardin = String(fila[8] || '').trim(); // Col J (índice 8) 🛑
const responsable = String(fila[9] || '').trim(); // Col K (índice 9) 🛑
const telefono = String(fila[10] || '').trim(); // Col L (índice 10) 🛑

const fechaNacimientoStr = (fechaNacimientoRaw instanceof Date) ? Utilities.formatDate(fechaNacimientoRaw, ss.getSpreadsheetTimeZone(), 'yyyy-MM-dd') : (fechaNacimientoRaw ? new Date(fechaNacimientoRaw).toISOString().split('T')[0] : '');

return {
status: 'OK',
datos: {
nombre: nombre, // 🛑
apellido: apellido, // 🛑
dni: dniLimpio,
fechaNacimiento: fechaNacimientoStr,
obraSocial,
colegioJardin,
adultoResponsable: responsable,
telefonoContacto: telefono
},
edad: calcularEdad(fechaNacimientoStr),
jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
tipoInscripto: tipoInscripto // (e) Pasa el tipo
};

} else {
// DNI NO EXISTE en Base de Datos
if (tipoInscripto === 'anterior') {
// ERROR: Es "nuevo" pero seleccionó "anterior"
return { status: 'ERROR_TIPO_ANT', message: "No se encuentra en la base de datos, por favor seleccione 'SOY NUEVO INSCRIPTO'" };
}

// Es "nuevo" y seleccionó "nuevo" -> OK
return {
status: 'OK_NUEVO',
message: '✅ DNI validado. Proceda al registro.',
jornadaExtendidaAlcanzada: estado.jornadaExtendidaAlcanzada,
tipoInscripto: tipoInscripto, // (e) Pasa el tipo
datos: { dni: dniLimpio }
};
}

} catch (e) {
Logger.log("Error en validarAcceso: " + e.message);
return { status: 'ERROR', message: 'Ocurrió un error al validar el DNI. ' + e.message };
}
}

/**
* (M) FUNCIÓN DE EMAIL (SIMPLIFICADA)
* Vuelve a recibir links como strings
* 🛑 ACTUALIZADO: Usa datos.nombre y datos.apellido
*/
/* */
function enviarEmailConfirmacion(datos, numeroDeTurno, init_point = null, overrideMetodo = null) {
try {
const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hojaConfig = ss.getSheetByName(NOMBRE_HOJA_CONFIG);

if (!hojaConfig || !datos.email || hojaConfig.getRange('B8').getValue() !== true) {
Logger.log("Envío de email deshabilitado o sin email.");
return;
}

let asunto = "";
let cuerpoOriginal = "";
let cuerpoFinal = "";
const nombreCompleto = (datos.nombre || '') + ' ' + (datos.apellido || '');

const metodo = overrideMetodo || datos.metodoPago;

if (metodo === 'Pago Online') {
asunto = hojaConfig.getRange('E2:G2').getValue();
cuerpoOriginal = hojaConfig.getRange('D4:H8').getValue();
if (!asunto) asunto = "Confirmación de Registro (Pago Total)";
if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nLink de Pago: {{linkDePago}}";

cuerpoFinal = cuerpoOriginal
.replace(/{{nombreCompleto}}/g, nombreCompleto.trim())
.replace(/{{numeroDeTurno}}/g, numeroDeTurno)
.replace(/{{linkDePago}}/g, init_point || 'N/A'); // init_point es un string (URL)

} else if (metodo === 'Pago Efectivo' || metodo === 'registro_sin_pago') {
asunto = hojaConfig.getRange('E13:H13').getValue();
cuerpoOriginal = hojaConfig.getRange('D15:H19').getValue();
if (!asunto) asunto = "Confirmación de Registro (Pago Efectivo)";
if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nPor favor, acérquese a la administración.";

cuerpoFinal = cuerpoOriginal
.replace(/{{nombreCompleto}}/g, nombreCompleto.trim())
.replace(/{{numeroDeTurno}}/g, numeroDeTurno);

} else if (metodo === 'Pago en Cuotas') {
asunto = hojaConfig.getRange('E24:G24').getValue();
cuerpoOriginal = hojaConfig.getRange('D26:H30').getValue();
if (!asunto) asunto = "Confirmación de Registro (Cuotas)";
if (!cuerpoOriginal) cuerpoOriginal = "Su cupo ha sido reservado.\n\nInscripto: {{nombreCompleto}}\nTurno: {{numeroDeTurno}}\n\nLink Cuota 1: {{linkCuota1}}\nLink Cuota 2: {{linkCuota2}}\nLink Cuota 3: {{linkCuota3}}";

// (M) init_point es ahora un objeto {link1, link2, link3} de strings (URLs)
cuerpoFinal = cuerpoOriginal
.replace(/{{nombreCompleto}}/g, nombreCompleto.trim())
.replace(/{{numeroDeTurno}}/g, numeroDeTurno)
.replace(/{{linkCuota1}}/g, init_point.link1 || 'Error al generar')
.replace(/{{linkCuota2}}/g, init_point.link2 || 'Error al generar')
.replace(/{{linkCuota3}}/g, init_point.link3 || 'Error al generar');

} else {
Logger.log(`Método de pago "${datos.metodoPago}" no reconocido para email.`);
return;
}

MailApp.sendEmail({
to: datos.email,
subject: `${asunto} (Turno #${numeroDeTurno})`,
body: cuerpoFinal
});

Logger.log(`Correo enviado a ${datos.email} por ${datos.metodoPago}.`);

} catch (e) {
Logger.log("Error al enviar correo (enviarEmailConfirmacion): " + e.message);
}
}

/**
* Sube un comprobante manual desde la pantalla de validación.
* 🛑 Constantes actualizadas
*/
function subirComprobanteManual(dni, fileData) {
const lock = LockService.getScriptLock();
lock.waitLock(30000);
try {
const dniLimpio = limpiarDNI(dni);
if (!dniLimpio || !fileData) {
return { status: 'ERROR', message: 'Faltan datos (DNI o archivo).' };
}

const fileUrl = uploadFileToDrive(fileData.data, fileData.mimeType, fileData.fileName, dniLimpio, 'comprobante');
if (typeof fileUrl !== 'string' || !fileUrl.startsWith('http')) {
throw new Error("Error al subir el archivo a Drive.");
}

const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hoja = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (!hoja) throw new Error(`La hoja "${NOMBRE_HOJA_REGISTRO}" no fue encontrada.`);

const rangoDni = hoja.getRange(2, COL_DNI_INSCRIPTO, hoja.getLastRow() - 1, 1); // 🛑
const celdaEncontrada = rangoDni.createTextFinder(dniLimpio).matchEntireCell(true).findNext();

if (celdaEncontrada) {
const fila = celdaEncontrada.getRow();
hoja.getRange(fila, COL_COMPROBANTE_MANUAL).setValue(fileUrl); // 🛑
hoja.getRange(fila, COL_ESTADO_PAGO).setValue("En revisión"); // 🛑

Logger.log(`Comprobante manual subido para DNI ${dniLimpio} en fila ${fila}.`);
return { status: 'OK', message: '¡Comprobante subido! Será revisado por la administración.' };
} else {
Logger.log(`No se encontró DNI ${dniLimpio} para subir comprobante manual.`);
return { status: 'ERROR', message: `No se encontró el registro para el DNI ${dniLimpio}.` };
}

} catch (e) {
Logger.log("Error en subirComprobanteManual: " + e.toString());
return { status: 'ERROR', message: 'Error en el servidor: ' + e.message };
} finally {
lock.releaseLock();
}
}

/**
* (a) Sube el certificado de aptitud física desde la pantalla de validación.
* 🛑 Constantes actualizadas
*/
function subirAptitudManual(dni, fileData) {
const lock = LockService.getScriptLock();
lock.waitLock(30000);
try {
const dniLimpio = limpiarDNI(dni);
if (!dniLimpio || !fileData) {
return { status: 'ERROR', message: 'Faltan datos (DNI o archivo).' };
}

const fileUrl = uploadFileToDrive(fileData.data, fileData.mimeType, fileData.fileName, dniLimpio, 'ficha');
if (typeof fileUrl !== 'string' || !fileUrl.startsWith('http')) {
throw new Error("Error al subir el archivo a Drive.");
}

const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
const hoja = ss.getSheetByName(NOMBRE_HOJA_REGISTRO);
if (!hoja) throw new Error(`La hoja "${NOMBRE_HOJA_REGISTRO}" no fue encontrada.`);

const rangoDni = hoja.getRange(2, COL_DNI_INSCRIPTO, hoja.getLastRow() - 1, 1); // 🛑
const celdaEncontrada = rangoDni.createTextFinder(dniLimpio).matchEntireCell(true).findNext();

if (celdaEncontrada) {
const fila = celdaEncontrada.getRow();
hoja.getRange(fila, COL_APTITUD_FISICA).setValue(fileUrl); // 🛑

Logger.log(`Aptitud Física subida para DNI ${dniLimpio} en fila ${fila}.`);
return { status: 'OK', message: '¡Certificado de Aptitud subido con éxito!' };
} else {
Logger.log(`No se encontró DNI ${dniLimpio} para subir aptitud física.`);
return { status: 'ERROR', message: `No se encontró el registro para el DNI ${dniLimpio}.` };
}

} catch (e) {
Logger.log("Error en subirAptitudManual: " + e.toString());
return { status: 'ERROR', message: 'Error en el servidor: ' + e.message };
} finally {
lock.releaseLock();
}
}

/* */
function sincronizarRegistros() {
Logger.log("sincronizarRegistros: Función omitida.");
return;
}

/**
* Sube un archivo individual de forma asíncrona desde el cliente.
*/
function subirArchivoIndividual(fileData, dni, tipoArchivo) {
try {
if (!fileData || !dni || !tipoArchivo) {
return { status: 'ERROR', message: 'Faltan datos para la subida (DNI, archivo o tipo).' };
}

const dniLimpio = limpiarDNI(dni);

const fileUrl = uploadFileToDrive(
fileData.data,
fileData.mimeType,
fileData.fileName,
dniLimpio,
tipoArchivo
);

if (typeof fileUrl === 'object' && fileUrl.status === 'ERROR') {
return fileUrl;
}

return { status: 'OK', url: fileUrl };

} catch (e) {
Logger.log("Error en subirArchivoIndividual: " + e.toString());
return { status: 'ERROR', message: 'Error del servidor al subir: ' + e.message };
}
}