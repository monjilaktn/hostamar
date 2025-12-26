package com.hostamar.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Notifications
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen() {
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Hostamar Command") },
                colors = TopAppBarDefaults.smallTopAppBarColors(
                    containerColor = Color(0xFF1E1E1E),
                    titleContentColor = Color.White
                ),
                actions = {
                    IconButton(onClick = { /* TODO: Open Alerts */ }) {
                        Icon(Icons.Default.Notifications, contentDescription = "Alerts", tint = Color.White)
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .padding(innerPadding)
                .fillMaxSize()
                .background(Color(0xFF121212))
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            // Revenue Card
            Card(
                modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Total Revenue (Today)", color = Color.Gray, fontSize = 14.sp)
                    Text("$1,240.00", color = Color.White, fontSize = 32.sp, fontWeight = FontWeight.Bold)
                    Text("+12% from yesterday", color = Color(0xFF00E676), fontSize = 12.sp)
                }
            }

            // Stats Grid
            Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                StatCard("Servers", "42 Active", Color(0xFF00E676), Modifier.weight(1f))
                Spacer(modifier = Modifier.width(16.dp))
                StatCard("New Leads", "8 Today", Color(0xFF2196F3), Modifier.weight(1f))
            }

            Spacer(modifier = Modifier.height(16.dp))

            // AI Insight
            Card(
                modifier = Modifier.fillMaxWidth(),
                colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E))
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("AI System Thoughts", color = Color(0xFFFF9800), fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        "\"Current focus: Auditing 3 new commits in 'Client-X-Repo'. Deployment predicted to succeed with 98% stability.\"",
                        color = Color.LightGray,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic
                    )
                }
            }
        }
    }
}

@Composable
fun StatCard(label: String, value: String, accentColor: Color, modifier: Modifier = Modifier) {
    Card(
        modifier = modifier,
        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E1E1E))
    ) {
        Column(
            modifier = Modifier.padding(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(label, color = Color.Gray, fontSize = 12.sp)
            Text(value, color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
        }
    }
}
