import torch
import torch.nn as nn

class PyTorchLSTMClassifier(nn.Module):
    def __init__(self, input_size: int = 6, hidden_size: int = 64, num_layers: int = 2, num_classes: int = 4, dropout: float = 0.2):
        super(PyTorchLSTMClassifier, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers

        self.lstm = nn.LSTM(
            input_size=input_size,
            hidden_size=hidden_size,
            num_layers=num_layers,
            batch_first=True,
            dropout=dropout if num_layers > 1 else 0.0
        )

        self.classifier = nn.Sequential(
            nn.Linear(hidden_size, 32),
            nn.ReLU(),
            nn.Dropout(dropout),
            nn.Linear(32, num_classes)
        )

    def forward(self, x):
        # x shape: [batch_size, sequence_length, input_size]
        lstm_out, (hn, cn) = self.lstm(x)
        # Take the hidden output of the final timestep
        out_last = lstm_out[:, -1, :]
        logits = self.classifier(out_last)
        return logits
