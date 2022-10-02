# include <stdio.h>

int main(){
   printf("Hello World!");
   return 0;
}

int * convolution(int * input, int * kernel, int inputSize, int kernelSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i, j, k;
    for(i = 0; i < inputSize; i++){
        output[i] = 0;
        for(j = 0; j < kernelSize; j++){
            k = i - j;
            if(k >= 0 && k < inputSize){
                output[i] += input[k] * kernel[j];
            }
        }
    }
    return output;
}

int * maxpool(int * input, int inputSize, int poolSize){
    int * output = (int *) malloc(sizeof(int) * inputSize / poolSize);
    int i, j, max;
    for(i = 0; i < inputSize / poolSize; i++){
        max = input[i * poolSize];
        for(j = 1; j < poolSize; j++){
            if(input[i * poolSize + j] > max){
                max = input[i * poolSize + j];
            }
        }
        output[i] = max;
    }
    return output;
}

int * fullyConnected(int * input, int * weights, int inputSize, int outputSize){
    int * output = (int *) malloc(sizeof(int) * outputSize);
    int i, j;
    for(i = 0; i < outputSize; i++){
        output[i] = 0;
        for(j = 0; j < inputSize; j++){
            output[i] += input[j] * weights[i * inputSize + j];
        }
    }
    return output;
}

int * softmax(int * input, int inputSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    float sum = 0;
    for(i = 0; i < inputSize; i++){
        sum += exp(input[i]);
    }
    for(i = 0; i < inputSize; i++){
        output[i] = exp(input[i]) / sum;
    }
    return output;
}

int * relu(int * input, int inputSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    for(i = 0; i < inputSize; i++){
        output[i] = input[i] > 0 ? input[i] : 0;
    }
    return output;
}

int * flatten(int * input, int inputSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    for(i = 0; i < inputSize; i++){
        output[i] = input[i];
    }
    return output;
}

int * reshape(int * input, int inputSize, int * shape, int shapeSize){
    int * output = (int *) malloc(sizeof(int) * inputSize);
    int i;
    for(i = 0; i < inputSize; i++){
        output[i] = input[i];
    }
    return output;
}

float negativeLoglikelihoodLoss(int * input, int * target, int inputSize){
    float loss = 0;
    int i;
    for(i = 0; i < inputSize; i++){
        loss += target[i] * log(input[i]);
    }
    return -loss;
}

float meanSquaredErrorLoss(int * input, int * target, int inputSize){
    float loss = 0;
    int i;
    for(i = 0; i < inputSize; i++){
        loss += (input[i] - target[i]) * (input[i] - target[i]);
    }
    return loss / inputSize;
}

