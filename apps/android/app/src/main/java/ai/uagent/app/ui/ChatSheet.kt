package ai.uagent.app.ui

import androidx.compose.runtime.Composable
import ai.uagent.app.MainViewModel
import ai.uagent.app.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
