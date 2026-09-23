import os
import torch
import torch.nn as nn
from torch.utils.data import TensorDataset, DataLoader
import numpy as np
from typing import Dict, Any, Tuple
from .lstm_model import PyTorchLSTMClassifier
from .metrics import calculate_classification_metrics

def train_lstm_model(
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_val: np.ndarray,
    y_val: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    save_path: str,
    epochs: int = 25,
    batch_size: int = 64,
    lr: float = 0.001,
    patience: int = 6
) -> Tuple[PyTorchLSTMClassifier, Dict[str, Any], Dict[str, list]]:
    """
    Trains PyTorch LSTM Classifier on X_train/y_train, evaluates on validation set for early stopping,
    and returns model, test metrics, and epoch history.
    """
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

    train_dataset = TensorDataset(torch.tensor(X_train, dtype=torch.float32), torch.tensor(y_train, dtype=torch.long))
    val_dataset = TensorDataset(torch.tensor(X_val, dtype=torch.float32), torch.tensor(y_val, dtype=torch.long))
    test_dataset = TensorDataset(torch.tensor(X_test, dtype=torch.float32), torch.tensor(y_test, dtype=torch.long))

    train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)
    test_loader = DataLoader(test_dataset, batch_size=batch_size, shuffle=False)

    input_size = X_train.shape[2]
    model = PyTorchLSTMClassifier(input_size=input_size, hidden_size=64, num_layers=2, num_classes=4, dropout=0.2).to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = torch.optim.Adam(model.parameters(), lr=lr, weight_decay=1e-4)

    best_val_loss = float("inf")
    patience_counter = 0

    history = {"trainLoss": [], "valLoss": [], "valAcc": []}

    for epoch in range(epochs):
        model.train()
        train_loss = 0.0
        for batch_x, batch_y in train_loader:
            batch_x, batch_y = batch_x.to(device), batch_y.to(device)
            optimizer.zero_grad()
            outputs = model(batch_x)
            loss = criterion(outputs, batch_y)
            loss.backward()
            optimizer.step()
            train_loss += loss.item() * batch_x.size(0)

        train_loss /= len(train_dataset)

        # Validation
        model.eval()
        val_loss = 0.0
        correct = 0
        total = 0
        with torch.no_grad():
            for batch_x, batch_y in val_loader:
                batch_x, batch_y = batch_x.to(device), batch_y.to(device)
                outputs = model(batch_x)
                loss = criterion(outputs, batch_y)
                val_loss += loss.item() * batch_x.size(0)
                preds = torch.argmax(outputs, dim=1)
                correct += (preds == batch_y).sum().item()
                total += batch_y.size(0)

        val_loss /= len(val_dataset)
        val_acc = (correct / total) * 100.0 if total > 0 else 0.0

        history["trainLoss"].append(round(train_loss, 4))
        history["valLoss"].append(round(val_loss, 4))
        history["valAcc"].append(round(val_acc, 2))

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            patience_counter = 0
            os.makedirs(os.path.dirname(save_path), exist_ok=True)
            torch.save(model.state_dict(), save_path)
        else:
            patience_counter += 1
            if patience_counter >= patience:
                break

    # Load best weights for final test set evaluation
    if os.path.exists(save_path):
        model.load_state_dict(torch.load(save_path, map_location=device))

    model.eval()
    y_test_preds = []
    with torch.no_grad():
        for batch_x, _ in test_loader:
            batch_x = batch_x.to(device)
            outputs = model(batch_x)
            preds = torch.argmax(outputs, dim=1).cpu().numpy()
            y_test_preds.extend(preds)

    metrics = calculate_classification_metrics(y_test, np.array(y_test_preds))
    metrics["model_name"] = "lstm"

    return model, metrics, history
