import json
from datetime import datetime, timedelta
from database import DB
from flask import Flask
from flask import request

DATE_FMT = "%d-%m-%Y %H:%M:%S"

app = Flask(__name__)

db = DB()
db.connect()


@app.route("/estancia", methods=["GET"])
def get_estancia_list():
    try:
        estancias = db.getAll("estancia")
        if not len(estancias):
            return "No content", 204

        for estancia in estancias:
            id = estancia.get('id')
            disp = db.getAll('dispositivo', 'id_Estancia', id)

            estancia["dispositivos"] = {
                "on": len(filter(lambda d: d.get("estado") == 1, disp)),
                "off": len(filter(lambda d: d.get("estado") == 0, disp)),
                "standby": len(filter(lambda d: d.get("estado") == 2, disp))
            }

    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(estancias), 200


@app.route("/estancia", methods=['POST'])
def create_estancia():
    nombre = request.form.get("nombre")
    ancho = request.form.get("ancho")
    alto = request.form.get("alto")

    if nombre and ancho and alto:
        estancia = {
            "nombre": nombre,
            "alto": alto,
            "ancho": ancho
        }

        try:
            db.add("estancia", estancia)
        except Exception as e:
            return "Internal server error.", 500

        estancia["id"] = db.lastid
        return json.dumps(estancia), 200
    return "Bad request.", 400
"""
@app.route("/estancia/consumo", methods=['GET'])
def get_consumo():
    try:
        historial = db.getAll("historico")

        consumo = 0;

        if not len(historial):
            return "No content", 204

        historial = sorted(historial, key=lambda id_disp: id_disp.get("id_dispositivo"))

        for id_disp in historial:
            for reg in historial:
                reg["fecha"] = datetime.strptime(reg.get("fecha"), DATE_FMT) or None

            historial = sorted(historial, key=lambda reg: reg.get("fecha"), reverse=True)

            consumo_ind = historial[0]
            consumo += consumo_ind.get("valor")

    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(consumo), 200

@app.route("/estancia/anual", methods=['GET'])
def get_consumo():
    try:
        historial = db.getAll("historico")

        if not len(historial):
            return "No content", 204

        for reg in historial:
            reg["fecha"] = datetime.strptime(reg.get("fecha"), DATE_FMT) or None

            historial = sorted(historial, key=lambda reg: reg.get("fecha"), reverse=True)

    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(consumo), 200
"""
@app.route("/estancia/<int:id>", methods=['GET'])
def get_estancia(id):
    try:
        estancia = db.get("estancia", {"id": id})
        if not len(estancia):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(estancia), 200

@app.route("/estancia/<int:id>", methods=['DELETE'])
def delete_estancia(id):
    try:
        db.delete("estancia", {"id": id})
    except Exception as e:
        return "Internal server error.", 500

    return "Ok", 200

@app.route("/estancia/<int:id>", methods=['POST'])
def create_dispositivo(id):
    nombre_disp = request.form.get("nombre_disp")
    estado = request.form.get("estado")
    posX = request.form.get("posX")
    posY = request.form.get("posY")

    if nombre_disp and estado and posX and posY:
        dispositivo = {
            "nombre": nombre_disp,
            "estado": estado,
            "posx": posX,
            "posy": posY,
            "id_Estancia": id
        }

        try:
            db.add("dispositivo", dispositivo)
        except Exception as e:
            return "Internal server error.", 500

            dispositivo["id"] = db.lastid
        return json.dumps(dispositivo), 200
    return "Bad request.", 400



@app.route("/estancia/<int:id>/dispositivo", methods=['GET'])
def get_dispositivo_list(id):
    try:
        dispositivo = db.getAll("dispositivo", "id_Estancia", id)
        if not len(dispositivo):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(dispositivo), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_disp>", methods=['GET'])
def get_dispositivo(id, id_disp):
    try:
        dispositivo = db.get("dispositivo", {"id": id_disp})
        if not len(dispositivo):
            return "No content", 204
        if dispositivo['id_Estancia'] != id:
            return "Wrong input", 404
    except Exception as e:
        print e
        return "Internal server error.", 500

    return json.dumps(dispositivo), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_disp>", methods=['PUT'])
def edit_dispositivo(id, id_disp):
    allowed = ["nombre", "posx", "posy"]
    form = dict(request.form)
    petitions = form.keys()

    fails = filter(lambda p: p not in allowed or not form.get(p), petitions)

    if len(fails):
        return "Bad request.", 400

    data = {}
    for p in petitions:
        data[p] = request.form.get(p).encode("utf-8")

    try:
        db.update("dispositivo", data, "id", id_disp)
        return "Ok", 200
    except Exception as e:
        print e
        return "Internal server error.", 500
    return "Bad request.", 400


@app.route("/estancia/<int:id>/dispositivo/<int:id_disp>", methods=['DELETE'])
def delete_dispositivo(id, id_disp):

    dispositivo = db.get("dispositivo", {"id": id_disp})

    if dispositivo['id_Estancia'] == id:

        try:
            db.delete("dispositivo", {"id": id_disp})
        except Exception as e:
            return "Internal server error.", 500

        return "Ok", 200
    else:
        return "Wrong input", 404

@app.route("/estancia/<int:id>/dispositivo/<int:id_disp>/historial", methods=['GET'])
def get_historial(id, id_disp):
    try:
        historial = db.getAll("historico", "id_dispositivo", id_disp)
        if not len(historial):
            return "No content", 204

        for reg in historial:
            reg["fecha"] = datetime.strptime(reg.get("fecha"), DATE_FMT) or None

        historial = sorted(historial, key=lambda reg: reg.get("fecha"), reverse=True)
    except Exception as e:
        print e
        return "Internal server error.", 500

    return json.dumps(historial, default=str), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_disp>/historial", methods=['DELETE'])
def delete_historial(id, id_disp):
    try:
        db.delete("historico", {"id_dispositivo": id_disp})
    except Exception as e:
        return "Internal server error.", 500

    return "Ok", 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_disp>/metricas", methods=['GET'])
def get_stat(id, id_disp):
    try:
        historial = db.getAll("historico", "id_dispositivo", id_disp)
        if not len(historial):
            return "No content", 204

        for reg in historial:
            reg["fecha"] = datetime.strptime(reg.get("fecha"), DATE_FMT) or None

        historial = sorted(historial, key=lambda reg: reg.get("fecha"), reverse=True)

        lastest = historial[0]
        limit = datetime.today() - timedelta(days=7)

        average = 0
        variance = 0

        last_week = list(filter(lambda reg: reg.get("fecha") > limit, historial))
        if last_week:
            for reg in last_week:
                average += reg.get("valor")
            average = average/len(last_week)

            for reg in last_week:
                variance += (reg.get("valor") - average) ** 2
            variance = variance/len(last_week)

        data = {
            "instantaneo": lastest.get("valor"),
            "media": average,
            "varianza": variance
        }
        return json.dumps(data, default=str), 200
    except Exception as e:
        print e

    return "Internal server error.", 500

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>/historial/<int:id_hist>", methods=['GET'])
def get_data(id, id_dips, id_hist):
    try:
        data = db.get("historico", {"id": id_hist})
        if not len(data):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(data), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>/historial/<int:id_hist>", methods=['DELETE'])
def delete_data(id, id_dips, id_hist):
    try:
        db.delete("historico", {"id": id_hist})
    except Exception as e:
        return "Internal server error.", 500

    return "Ok", 200

def main():
    app.run(host="0.0.0.0", port=5000, debug=True)


if __name__ == "__main__":
    main()
