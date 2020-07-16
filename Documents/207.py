from sklearn.utils import _joblib as joblib
from sklearn.model_selection import train_test_split
from sklearn.tree import DecisionTreeClassifier
import pandas as pd
parameter_0_0_1_0=pd.read_csv(filepath_or_buffer="/code/Media/207/upload/iris(1).csv",header=0)
data = parameter_0_0_1_0
parameter_1_0_3_0 = data.iloc[:, :-1]
parameter_1_1_3_1 = data.iloc[:, -1]
parameter_3_0_4_0,parameter_3_1_2_1,parameter_3_2_4_1,parameter_3_3_2_2 = train_test_split(parameter_1_0_3_0,parameter_1_1_3_1,random_state=None,test_size=0.8)
parameter_4_0_2_0 = DecisionTreeClassifier(criterion="entropy",splitter="random",max_depth=50,min_samples_split=2,min_samples_leaf=1,min_weight_fraction_leaf=0,max_features=None,random_state=None,max_leaf_nodes=50,min_impurity_decrease=1,min_impurity_split=0,class_weight=None,ccp_alpha=0)
parameter_4_0_2_0.fit(parameter_3_0_4_0, parameter_3_2_4_1)
joblib.dump(parameter_4_0_2_0,filename="/code/Media/207/upload/1.m")
parameter_2_0_2_null=parameter_4_0_2_0.score(parameter_3_1_2_1, parameter_3_3_2_2)
