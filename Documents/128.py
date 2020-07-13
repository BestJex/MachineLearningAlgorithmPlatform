import pandas as pd
from sklearn.ensemble import AdaBoostClassifier
from sklearn.tree import *
from sklearn.utils import _joblib as joblib
parameter_3_csv_2_data=pd.read_csv(filepath_or_buffer="/code/Media/28/upload/sample_submission.csv",header="是")
data = parameter_3_csv_2_data
parameter_2_X_0_model = data.iloc[:, :-1]
parameter_2_y_2_null = data.iloc[:, -1]
parameter_0_accuracy_1_traindata_X=parameter_2_X_0_model.score(parameter_2_X_0_X_test, parameter_2_X_0_y_test)
parameter_1_model_1_null = AdaBoostClassifier(base_estimator=DecisionTreeClassifier(max_depth=1),n_estimators=50,learning_rate=0.1,algorithm="SAMME.R",random_state=2)
parameter_1_model_1_null.fit(parameter_0_accuracy_1_traindata_X, parameter_0_accuracy_1_traindata_y)
joblib.dump(parameter_1_model_1_null,filename="123")
