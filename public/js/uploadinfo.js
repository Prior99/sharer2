var infoHtml;

$.ajax("/html/uploadinfo.html").done(function(html) {
	infoHtml = html;
});

var UploadInfo = function(filename, container) {
	this.elem = $(infoHtml);
	this.filename = filename;
	this.file = this.elem.find(".filename").html(filename);
	this.progressbar = this.elem.find(".progress-bar");
	this.percentage = this.elem.find(".percentage");
	this.icon = this.elem.find(".icon");
	this.elem.appendTo(container);
};

UploadInfo.prototype.setActive = function() {
	this.progressbar.addClass("active");
	this.icon.addClass("fa-spin");
};

UploadInfo.prototype.setInactive = function() {
	this.progressbar.removeClass("active");
	this.icon.removeClass("fa-spin");
};

UploadInfo.prototype.setProgress = function(percent) {
	percent = Math.round(percent) + "%";
	this.percentage.html(percent);
	this.progressbar.css({"width" : percent});
};

UploadInfo.prototype._finish = function() {
	this.setProgress(100);
	this.setInactive();
	this.icon.removeClass("fa-cog");
	this.progressbar.removeClass("progress-bar-info");
};

UploadInfo.prototype.finishSuccess = function(url) {
	this._finish();
	this.icon.addClass("fa-check");
	this.progressbar.addClass("progress-bar-success");
	this.file.html("<a href='" + url + "'><i class='fa fa-download'></i> " + this.filename + "</a>");
};

UploadInfo.prototype.finishFailed = function() {
	this._finish();
	this.progressbar.addClass("progress-bar-danger");
	this.icon.addClass("fa-times");
};

UploadInfo.prototype.finish = function(success, url) {
	if(success) {
		this.finishSuccess(url);
	}
	else {
		this.finishFailed();
	}
};
