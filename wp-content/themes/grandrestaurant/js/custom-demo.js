jQuery(document).ready(function() {
	jQuery('#option_btn').click(
		function() {
			if(jQuery('#option_wrapper').css('right') != '0px')
			{	
				jQuery('#option_wrapper').animate({"right": "0px"}, { duration: 500 });
				 jQuery(this).animate({"right": "400px"}, { duration: 500 });
			 }
			 else
			 {
				jQuery('#option_wrapper').animate({"right": "-401px"}, { duration: 500 });
				jQuery('#option_btn').animate({"right": "-0px"}, { duration: 500 });
			 }
		}
	);
});