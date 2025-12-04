[System.Reflection.Assembly]::LoadWithPartialName('System.Drawing') | Out-Null

foreach ($f in @('gallery1', 'gallery2', 'gallery3')) {
  $src = "assets/$f.jpg"
  $dst = "assets/$f-small.jpg"
  
  if (-not (Test-Path $src)) {
    Write-Host "NOT_FOUND: $src"
    continue
  }
  
  $img = [System.Drawing.Image]::FromFile($src)
  $h = [int]([double]400 * $img.Height / $img.Width)
  $bmp = New-Object System.Drawing.Bitmap(400, $h)
  $g = [System.Drawing.Graphics]::FromImage($bmp)
  $g.DrawImage($img, 0, 0, 400, $h)
  $g.Dispose()
  
  $enc = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
  $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
  $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, 75)
  $bmp.Save($dst, $enc, $ep)
  $bmp.Dispose()
  $img.Dispose()
  
  Write-Host "RESIZE_DONE:$dst"
}
