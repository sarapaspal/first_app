import json
from database import DB
from flask import Flask
from flask import request

app = Flask(__name__)

db = DB()
db.connect()


@app.route("/estancia", methods=["GET"])
def get_estancia_list():
    try:
        estancias = db.getAll("estancia")
        if not len(estancias):
            return "No content", 204
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


@app.route("/estancia/<int:id>/dispositivos", methods=['GET'])
def get_dispositivos_list(id):
    try:
        dispositivos = db.getAll("dispositivo", {"id_Estancia": id})
        if not len(dispositivos):
            return "No content", 204
    except Exception as e:
        print e
        return "Internal server error.", 500

    return json.dumps(dispositivos), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>", methods=['GET'])
def get_dispositivo(id_disp):
    try:
        dispositivo = db.get("dispositivo", {"id_dips": id_disp})
        if not len(dispositivo):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(dispositivo), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>", methods=['POST'])
def create_dispositivo():
    nombre_disp = request.form.get("nombre_disp")
    estado = request.form.get("estado")
    posX = request.form.get("posX")
    posY = request.form.get("posY")

    if nombre_disp and estado and posX and posY:
        dispositivo = {
            "nombre_disp": nombre_disp,
            "estado": estado,
            "posX": posX,
            "posY": posY
        }

        try:
            db.add("dispositivo", dispositivo)
        except Exception as e:
            return "Internal server error.", 500

            dispositivo["id"] = db.lastid
        return json.dumps(dispositivo), 200
    return "Bad request.", 400

''' @app.route("/estancia/<int:id>/dispositivo/<int:id_dips>", methods=['PUT'])
def edit_dispositivo(id_dips):
    try:
        estancia = db.get("estancia", {"data":data} ,{"id_dips": id_dips}, {"value":value})
        if not len(estancia):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(estancia), 200
'''

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>", methods=['DELETE'])
def delete_dispositivo(id_dips):
    try:
        db.delete("dispositivo", {"id_dips": id_dips})
    except Exception as e:
        return "Internal server error.", 500

    return "Ok", 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>/historial", methods=['GET'])
def get_historial(id_disp):
    try:
        historial = db.get("historico", {"id_dips": id_disp})
        if not len(historial):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(historial), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>/historial", methods=['DELETE'])
def delete_historial(id_dips):
    try:
        db.delete("historico", {"id_dips": id_dips})
    except Exception as e:
        return "Internal server error.", 500

    return "Ok", 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>/historial/<int:id_hist>", methods=['GET'])
def get_data(id_hist):
    try:
        data = db.get("historico", {"id_hist": id_hist})
        if not len(data):
            return "No content", 204
    except Exception as e:
        return "Internal server error.", 500

    return json.dumps(data), 200

@app.route("/estancia/<int:id>/dispositivo/<int:id_dips>/historial/<int:id_hist>", methods=['DELETE'])
def delete_data(id_hist):
    try:
        db.delete("historico", {"id_hist": id_hist})
    except Exception as e:
        return "Internal server error.", 500

    return "Ok", 200

def main():
    app.run(host="0.0.0.0", port=5000, debug=True)


if __name__ == "__main__":
    main()
