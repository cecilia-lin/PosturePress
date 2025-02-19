# PosturePress
An interactive visualization of the Pressure map of different sleeping postures




# About Dataset
This [dataset](https://physionet.org/content/pmd/1.0.0/) is a collection of in-bed posture pressure data from healthy
adults.


## data folder layout
    .
    ├── data                        # Experimental data
    │   ├── experiment-i            # First experiment dataset
    │   │   ├── S1                  # Subject 1 data
    │   │   ├── S2                  # Subject 2 data
    │   │   ├── S3                  # Subject 3 data
    │   │   ├── ...
    │   │   ├── S13                  # Subject 13 data 
    │   ├── experiment-ii            # second experiment dataset
    │   │   ├── S1                  # Subject 1 data
    │   │   ├── S2                  # Subject 2 data
    │   │   ├── S3                  # Subject 3 data
    │   │   ├── ...
    │   │   ├── S8                  # Subject 8 data 
    │   ├── experiment-info.docx     # Experiment details
    │   ├── SHA256SUMS.txt           # Checksum file
    │   ├── subject_info.csv         # Subject metadata


# Motivation
---
Sleep is essential to survival! No one wants to get up to sore joints and neck pain, or worse, wake up with a bed sore after a long night of not-so-restful rest. This is a topic of interest for doctors, patients, and also everyday people, as we all sleep in different positions every night. Most importantly, for bedridden patients who cannot flip independently, we want to provide some insights for them to understand how different sleep positions affect the pressure placed on different body parts and what position is most ideal for them during a long night of sleep. In this interactive visualization, we aim to answer two questions: Based on a person’s past sleeping postures, which area of their body will experience the highest pressure? Given certain body parts that a person doesn’t want to experience pressure (such as an injured shoulder), what kind of sleep posture is most recommended? Thus, this visualization addresses the needs of caregivers, patients, and anyone who sleeps by informing them of which sleeping position is most beneficial to relieve pressure and personalized to fit their specific height and weight.

# Data Transformation
---
We have 39 sequences of sensor frames in total from 13 experiment participants of different weights and heights in different sleeping postures. The three contour maps we visualize contain aggregated sensor frames corresponding to three different positions (sleeping on the left side, sleeping on your back/supine, and sleeping on the right side) that are specific to the participant closest to the user’s inputted height and weight. To select three records from 39 total records, we filter the data based on weight and height. When a user enters their customized weight and height, we calculate the Euclidean distance between the input and the 13 experiment participants and find the participants with the lowest Euclidean distance relative to the input variable. In addition, we also transform all the sensor data by multiplying 100 by each point to get a unit of mmHg. 

# Design Rationale 
---
First, we explored static visualizations to have a better understanding of the data. We sought a data visualization that would provide users with more information on which body parts are most affected in different sleeping postures. The first idea we came across was using filtering to help users select different postures for side-by-side comparison, and they could filter the visualization by their own BMI as well to find data more relevant to them. However, we thought BMI was too reductive of a measurement, and thought that this initial idea could have easily been achieved with only a static dashboard. Thus, we pivoted to other interactions to make our dashboard more interactive and informative. 

Since there are a lot of sensor points, we thought it would be a good idea to see where exactly a pressure point is on the patient, and thus, we focused on zooming and hovering for our interactions. Hovering allows users to focus on and identify the pressure put on a specific point of the body that they are concerned with, such as the shoulders. A tooltip that appears when the user hovers over their body part of interest and displays the exact pressure reading in mmHg. 

Zooming in and out allows users to further choose a subset to focus on and get more specificity in how pressure changes as you move across the body, away or towards points of interest. As such, we chose a contour map instead of a heat map for the visualization because pressure is continuous throughout the body part and not limited only to the sensor area so it better represents the continuous changes in pressure across the body than a heat map, which instead shows a discrete map of pressure. Lastly, the color scale for pressure is deliberately chosen to be color-blind friendly, with the use of red to indicate body parts experiencing high pressure for a specific posture and moves on a gradient from blue, which represents low pressure at the other end of the scale.

To avoid clutter, we narrowed down the 13 sleep postures into the three most common postures, which are supine or sleeping on the back, sleeping on the left side, and sleeping on the right side. This subset of data can help users focus on interacting with the 3 data visualizations while not getting overwhelmed by the different postures and easily compare them all side by side. To add to the user’s control in the interaction and make this experience more personalized to them, we included filtering by asking the user to enter their weight and height, which we would then use to find and display the charts for the subject with the closest height and weight combination as the user’s input, as described in the data transformation section. This helps the user understand more accurately what pressure looks like for their own body instead of seeing aggregates of anonymous other people they know nothing about.

As for future directions, additional design choices we intend to include for the future include a unit conversion option on the site to allow global audiences to interact with the data visualization more intuitively, although currently, it is already in the most commonly used metric units of kilograms and centimeters.

We are also interested in examining more of the experiment data, but due to the heterogeneity presented by the usage of different measurement instruments, we chose not to include the second experiment in this visualization. However, the additional data on other variations in sleeping posture could still provide valuable insights into more possible features of what may cause pressure hot spots to occur in the first place and provide users with even more specific information on how they should sleep.

# Development Process
--
Our group met in person and on Discord twice a week to coordinate our work and provide peer feedback. We used GitHub for version control and Discord for daily communication. Cecilia focused on the data preprocessing, the website layout and design, and the write-up for the project. Felix focused on the implementation of the zooming and tooltip hovering function of the contour map. Ashley implemented part of the contour map and color scale corresponding to the contour map. Guoxuan implemented the filter function that selects sample data based on the input weight and height. He implemented the reset functionality with a reset button. Once the user clicks the reset button, the plot will be set to the default state. Moreover, he debugged most of the parts of the contour map and color scale implementation. We all worked on the write-up.

## Challenge
--
One challenge we faced was implementing the color scale for our contour map, which we resolved by checking the documentation and interacting with the GitHub copilot.
The core issue is the rendering of the SVG object, as we struggled to fit it aesthetically to the exact dimensions of the bounding box. Specifically, it has a problem integrating with the flex box object in the HTML. Therefore, we needed to move back and forth between HTML and JavaScript to figure out the issue.
Another challenge we encountered was creating a contour map. To make sure the contour map scale is according to the size of the window, we need to find a way to access the size of the window and the related object and rescale the plot accordingly. We resolve the issue by calling “svg.node().getBoundingClientRect()” 


# Citation
--
M. Baran Pouyan, J. Birjandtalab, M. Heydarzadeh, M. Nourani, S. Ostadabbas. A pressure map dataset for posture and subject analytics. 2017 IEEE EMBS International Conference on Biomedical & Health Informatics (BHI). DOI: 10.1109/BHI.2017.7897206.

Goldberger, A., Amaral, L., Glass, L., Hausdorff, J., Ivanov, P. C., Mark, R., ... & Stanley, H. E. (2000). PhysioBank, PhysioToolkit, and PhysioNet: Components of a new research resource for complex physiologic signals. Circulation [Online]. 101 (23), pp. e215–e220.

P.S. Class Project for DSC 106: Data Visualization
