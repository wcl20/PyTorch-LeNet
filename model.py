import torch
import torch.nn as nn
import torch.nn.functional as F

class LeNet(nn.Module):
  def __init__(self):
    super(LeNet, self).__init__()
    self.conv1 = nn.Conv2d(1, 6, 5)
    self.conv2 = nn.Conv2d(6, 16, 5)
    self.pool = nn.MaxPool2d(2)
    self.fc1 = nn.Linear(16 * 4 * 4, 120)
    self.fc2 = nn.Linear(120, 84)
    self.fc3 = nn.Linear(84, 10)

  def forward(self, x):
    output = F.relu(self.conv1(x))            # Output size: N x 6 x 24 x 24
    output = self.pool(output)                # Output size: N x 6 x 12 x 12
    output = F.relu(self.conv2(output))       # Output size: N x 16 x 8 x 8
    output = self.pool(output)                # Output size: N x 16 x 4 x 4
    output = output.view(output.shape[0], -1) # Output size: N x 256
    output = F.relu(self.fc1(output))         # Output size: N x 120
    output = F.relu(self.fc2(output))         # Output size: N x 84
    output = self.fc3(output)                 # Output size: N x 10
    return F.softmax(output, dim=1)
