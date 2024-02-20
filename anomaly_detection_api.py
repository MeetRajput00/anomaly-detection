from flask import Flask, request,jsonify
from flask_cors import CORS, cross_origin
import pickle
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import MinMaxScaler
import pandas as pd

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
filename = 'model.sav'
model = pickle.load(open(filename, 'rb'))

def scale_input(data):
    scaler = MinMaxScaler()
    result= scaler.fit_transform(data)
    return result        

@app.route('/check-anomaly', methods=['POST'])
@cross_origin()
def check_anomaly():
    data = request.json
    df = pd.DataFrame(parse_request_data(data))
    prediction = model.predict(scale_input(df))
    response = jsonify(message=str(prediction[0]))
    response.headers.add('Content-Type', 'application/json')
    return response

def parse_request_data(data):
    service=int(data['service'])
    flag=int(data['flag'])
    src_bytes=int(data['src_bytes'])
    dst_bytes=int(data['dst_bytes'])
    logged_in=int(data['logged_in'])
    same_srv_rate=float(data['same_srv_rate'])
    diff_srv_rate=float(data['diff_srv_rate'])
    dst_host_srv_count=int(data['dst_host_srv_count'])
    dst_host_same_srv_rate=float(data['dst_host_same_srv_rate'])
    dst_host_diff_srv_rate=float(data['dst_host_diff_srv_rate'])
    data_dict={
        'service':[service],
        'flag':[flag],
        'src_bytes':[src_bytes],
        'dst_bytes':[dst_bytes],
        'logged_in':[logged_in],
        'same_srv_rate':[same_srv_rate],
        'diff_srv_rate':[diff_srv_rate],
        'dst_host_srv_count':[dst_host_srv_count],
        'dst_host_same_srv_rate':[dst_host_same_srv_rate],
        'dst_host_diff_srv_rate':[dst_host_diff_srv_rate]
    }
    
    return data_dict


if __name__ == '__main__':
    app.run(host='0.0.0.0',debug=True)
